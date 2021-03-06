var RulesValidator = require('./rulesValidator');

var Rule = function () {

  "use strict";

  var Rule = function(options) {
    if (this instanceof Rule) {
      options = options || {};
      this.association = options.association || null;
      this.errors = [];
      this.ifInvalidThenFn = null;
      this.ifValidThenFn = null;
      this.ifValidThenGetRulesFn = null;
      this.validSuccessors = [];
      this.invalidSuccessors = [];
      this.valid = true;
    } else {
      return new Rule();
    }
  };

  Rule.getAllRulesFrom = function(commands, done) {

    if (!Array.isArray(commands)) {
      commands = [commands];
    }

    var count = commands.length;

    if (count < 1) return done(null, []);

    var current = 0;
    var context = {};
    var rules = [];

    commands.forEach(command => {
      command._getRules(context, onComplete);
    });

    function onComplete(err, rule) {
      if (err) { return done(err, rules); }
      if (Array.isArray(rule)) {
        rule.forEach(function(r) { rules.push(r) });
      } else {
        rules.push(rule);
      }
      current++;
      if (current === count) {
        done(null, rules);
      }
    }
  };

  Rule.ifAllValid = function(rules) {

    function thenGetRules(func) {
      var rule = new Rule();
      rule._onValidate = function(done) {
        done();
      };

      rule.validSuccessors = rules;
      rule.ifValidThenGetRulesFn = func;
      return rule;
    }

    return {
      thenGetRules: thenGetRules
    };

  };

  Rule.extend = function(options) {
    options = options || {};
    options.functions = options.functions || {};

    if (typeof options.functions._onValidate !== 'function') {
      throw new Error('An onValidate method needs to be supplied to execute!');
    }

    options.association = options.association || null;
    options.params = options.params || [];

    var Extended = function() {
      var self = this;
      self.arguments = arguments;
      Rule.call(self, { association: options.association });
      options.params.forEach(function(field, index) {
        self[field] = self.arguments[index];
      });
    };

    Extended.prototype = new Rule();
    Extended.prototype._onValidate = options.functions._onValidate;

    return Extended;
  };

  Rule.prototype = {

    constructor: Rule,

    _invalidate: function(errors) {
      var self = this;
      this.valid = false;
      if (!Array.isArray(errors)) {
        errors = [errors];
      }
      errors.forEach(function(err) {
        if (typeof err === "string") {
          self.errors.push({ association: self.association, message: err });
        } else {
          self.errors.push(err);
        }
      });
    },

    /**
     * This set a invalid Rule to valid again.
     * which is used for the ifInvalidThenValidate Functionality.
     * @private
     */
    _unInvalidate: function () {
      var self = this;
      this.valid = true;
      self.errors = [];
    },

    _onValidate: function (done) {},

    validate: function(done) {
      var self = this;
      self.errors = [];

      this._onValidate(function(err) {
        if (err) return done(err);
        if (self.valid) {
          if (self.ifValidThenFn) {
            self.ifValidThenFn();
          }
          if (self.validSuccessors.length > 0) {
            new RulesValidator(self.validSuccessors).validate(function (err) {
              if (err) return done(err);
              invalidate(self).ifAnyInvalid(self.validSuccessors);
              if (self.ifValidThenGetRulesFn) {
                return invokeNextRules(self, self.validSuccessors, done);
              }
              done();
            });
            return;
          } else {
            if (self.ifValidThenGetRulesFn) {
              return invokeNextRules(self, self.validSuccessors, done);
            }
          }
        } else {
          if (self.ifInvalidThenFn) {
            self.ifInvalidThenFn();
          }
          /*
           * As in the Valid case,
           * if rules are chained by .ifInvalidThenValidate all
           * successors should be checked.
           *
           * The rule is then validate if ALL successors are validate.
           * This provides a logical-OR behaviour. So the rule itself doesn't need to be validate,
           * but all it's alternatives.
           */
          if (self.invalidSuccessors.length > 0) {
            new RulesValidator(self.invalidSuccessors).validate(function (err) {
              if (err) return done(err);
              invalidate(self).ifAnyInvalid(self.invalidSuccessors);
              done();
            });
            return;
          }
        }
        done();
      });

      function invokeNextRules(rule, rules, done) {
        var failedRules = rules.filter(function(rule) { return !rule.valid; });
        if (failedRules.length === 0) {
          rule.ifValidThenGetRulesFn(function(err, result) {
            if (!Array.isArray(result)) {
              result = [result];
            }
            new RulesValidator(result).validate(function(err) {
              if (err) return done(err);
              invalidate(rule).ifAnyInvalid(result);
              done();
            });
          });
        } else {
          done();
        }
      }

      function invalidate(rule) {

        function ifAnyInvalid(rules) {
          const invalidRules = rules.filter(function (r) {
            return !r.valid;
          });
          // set the invalid-status if there are invalid rules
          if(invalidRules.length > 0) {
            invalidRules.forEach(function (r) {
              rule._invalidate(r.errors);
            });
          }
          // otherwise set it valid
          else {
            rule._unInvalidate();
          }

        }

        return { ifAnyInvalid: ifAnyInvalid };
      }
    },

    ifValidThenValidate: function(rules) {
      if (!Array.isArray(rules)) {
        rules = [rules];
      }
      this.validSuccessors = rules;
      return this;
    },

    ifValidThenExecute: function(funcToExecute) {
      this.ifValidThenFn = funcToExecute;
      return this;
    },

    /**
     * If a rule is invalid then this function adds an alternative.
     * if the alternative is true, also the rule is.
     *
     * A special case apply by using an array of rules as alternative,
     * in this case, all rules in the array will be joined by an AND by default,
     * so that the alternative is valid, if ALL rules of the alternative are valid
     *
     * @param {Rule|Array<Rule>} rules the alternative rule(s) that should be checked when the rule is invalid
     * @return {Rule}
     */
    ifInvalidThenValidate: function (rules) {
      if (!Array.isArray(rules)) {
        rules = [rules];
      }
      this.invalidSuccessors = rules;
      return this;
    },

    ifInvalidThenExecute: function(funcToExecute) {
      this.ifInvalidThenFn = funcToExecute;
      return this;
    },

    ifValidThenGetRules: function(funcToExecute) {
      this.ifValidThenGetRulesFn = funcToExecute;
      return this;
    }

  };

  return Rule;
}();

module.exports = Rule;
