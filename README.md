# nori.js

Tiny and easy to use JavaScript Inversion of Control (IoC) framework.

## Features

* Tiny and easy to use
* Asynchronous Module Definition (AMD) support (soon!)
* Dependency Injection
  * Injection via properties
  * Injection via constructor
  * Singleton (default) and Prototype beans
* Aspect-oriented programming (AOP)
  * Advices: before, after, afterThrow, afterFinally, around and introduction
  * Method name matching with Regular Expressions
  * Dependency injection container integration

## How to use

* Dependency Injection
  * Basic [Example](https://github.com/gil/nori.js/blob/master/examples/injection/simple/Index.html)
  * Injecting beans via constructor [Example](https://github.com/gil/nori.js/blob/master/examples/injection/constructor/Index.html)
  * Injecting properties with custom names [Example](https://github.com/gil/nori.js/blob/master/examples/injection/namedProperties/Index.html)
  * Prototype (non-singleton) beans [Example](https://github.com/gil/nori.js/blob/master/examples/injection/prototypeBean/Index.html)
* AOP
  * Basic (before/after) [Example](https://github.com/gil/nori.js/blob/master/examples/aop/simple/Index.html)
  * Replacing methods (introduction) [Example](https://github.com/gil/nori.js/blob/master/examples/aop/introduction/Index.html)
  * Controlling method execution and arguments (around) [Example](https://github.com/gil/nori.js/blob/master/examples/aop/around/Index.html)
  * Handling exceptions (afterThrow/afterFinally) [Example](https://github.com/gil/nori.js/blob/master/examples/aop/exceptions/Index.html)
  * Method name matching with RegExp [Example](https://github.com/gil/nori.js/blob/master/examples/aop/regexp/Index.html)
  * Dependency Injection bean configuration AOP [Example](https://github.com/gil/nori.js/blob/master/examples/aop/beans/Index.html)

## How to build

To install, first make sure you have a working copy of the latest stable version of [Node.js](http://nodejs.org/). You can then install the following packages with npm (Node Package Manager):

```
npm install -g grunt
npm install -g coffee-script
npm install grunt-coffee
```

Then run `grunt` to build nori.js or `grunt watch` to keep watching files for changes.