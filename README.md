![peasy-js](https://www.dropbox.com/s/2yajr2x9yevvzbm/peasy3.png?dl=0&raw=1)

```javascript
A middle tier micro-framework for javascript
```

<p>
<a href="https://gitter.im/peasy/peasy-js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge" target="_blank">
	<img src="https://badges.gitter.im/peasy/peasy-js.svg" alt="Gitter">
</a>
<a href="https://www.npmjs.com/package/peasy-js" target="_blank">
	<img src="https://badge.fury.io/js/peasy-js.svg" alt="npm version">
</a>
<a href="https://travis-ci.org/peasy/peasy-js">
	<img src="https://travis-ci.org/peasy/peasy-js.svg?branch=master" alt="travis">
</a>
</p>

# What's a middle tier framework?


A middle tier framework is code that facilitates creating business logic in a reusable, extensible, maintainable, and testable manner.   It promotes creating business logic that is completely decoupled from its consuming technologies and helps to ensure that separation of concerns ([SoC](https://en.wikipedia.org/wiki/Separation_of_concerns)) are adhered to.

##### peasy-js offers/addresses the following:

- [Business and validation rules](https://github.com/peasy/peasy-js/wiki/Business-and-Validation-Rules) engine
- [Multiple client support](https://github.com/peasy/peasy-js/wiki/Multiple-Client-Support)
- [Multiple deployment scenario support](https://github.com/peasy/peasy-js/wiki/Data-Proxy#multiple-deployment-scenarios)
- Reusability (decouples business and validation logic from consuming code and frameworks)
- [Scalability](https://github.com/peasy/peasy-js/wiki/Data-Proxy#scalability)
- [Testability](https://github.com/peasy/peasy-js/wiki/Testing)

# Why peasy-js?

Because the javascript ecosystem changes at a pace much more rapid than your business logic.  UI frameworks change: Backbone one day, Angular the next day, React the following...  Backend frameworks change: Express one day, Koa the next day, Hapi the next... Data frameworks and ORMS change...  

Why couple your code with technologies that are hot today and gone tomorrow?  Why not focus on your business logic and abstract out everything else into truly reusable code that can be consumed by javascript in the browser, backend, or both, and by any UI or backend framework? 

peasy-js makes it trivial to whimsically swap out UI, backend, and data frameworks in your applications by creating your business logic in a composable, reusable, scalable, and testable manner.

# The main actors

### Data Proxy
The [data proxy](https://github.com/peasy/peasy-js/wiki/Data-Proxy) is responsible for data storage and retrieval, and serves as an abstraction layer for data stores (database, web services, cache, etc.).

### Rule
A [rule](https://github.com/peasy/peasy-js/wiki/Business-and-Validation-Rules) can be created to represent a business rule (authorization, price validity, etc.) or a validation rule (field length, required, etc.). Rules are consumed by commands and can be chained, configured to execute based on a previous rule’s execution, etc. Rules can also be configured to invoke code based on the result of their execution.

### Command
The [command](https://github.com/peasy/peasy-js/wiki/Command) is responsible for orchestrating the execution of initialization logic, business and validation rule execution, and other logic (data proxy invocations, workflow logic, etc.), respectively, via the command execution pipeline.

### Business Service
A [business service](https://github.com/peasy/peasy-js/wiki/BusinessService) implementation represents an entity (e.g. users, or projects) and is responsible for exposing business functionality via commands. These commands encapsulate CRUD and other business related logic.

# Where can I get it?

- [Download the latest release](https://github.com/peasy/peasy-js/archive/master.zip)
- Clone the repo: ```git clone https://github.com/peasy/peasy-js.git```
- Install with **npm**: ```npm install peasy-js```
- Install with **yarn**: ```yarn add peasy-js```

You can also download and add the [peasy.js](https://github.com/peasy/peasy-js/blob/master/lib/peasy.js) file to your project and reference it accordingly.

# Getting started

You can get started by reviewing the walk throughs below.

- Run it in a [client](https://github.com/peasy/peasy-js/wiki/Browser-sample) (browser)
- Run it on a [server](https://github.com/peasy/peasy-js/wiki/node.js-sample) (Node.js)

An additional sample can be viewed [here](https://github.com/peasy/peasy-js/blob/master/src/sample.js) that showcases creating a [business service](), custom [command](), [business rules](), and wiring them up.  The sample also showcases how to consume the service.  To see it in action, run: ```node src/sample.js``` from a command line.

An entire middle-tier implementation using peasy-js can be viewed [here](https://github.com/peasy/peasy-js-samples).  This sample application is a ficticious order entry / inventory management system.

For additional help, be sure to checkout the [wiki](https://github.com/peasy/peasy-js/wiki) as it covers in-depth how-to's, general framework design, and usage scenarios.

# Contributing

All contributions are welcome, from general framework improvements to sample client consumers, proxy implementations, and documentation updates.  Want to get involved?  Please hit us up with your ideas.  Alternatively, you can make a pull request and we'll get to it ASAP.

# Like what you see?

Please consider showing your support by starring the project.
