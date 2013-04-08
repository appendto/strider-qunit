# Strider-QUnit
## A test runner for [QUnit](http://qunitjs.com/)

If your project uses QUnit to test client side code, this [strider](http://stridercd.com)
extension will allow you to run those tests in a browser. This plugin is best used with
some sort of cloud-browser testing service such as
[Sauce Labs](https://github.com/Strider-CD/strider-sauce) or
[Browserstack](https://github.com/Strider-CD/strider-browserstack)

**Shameless Plug**: If you're using Sauce Labs, sign up with the promo code `frozenridge`
and you'll get 5% off :)

## Configuration

We try and do the smart thing - so if you have a test directory with `index.html` and `qunit.js`
we'll use that. If your qunit tests are served in a different file, you can modify that from the
strider configuration page.

## How it works

We run a little server that serves your test files. We then use either your cloud-browser-testing
service of choice or wait for you to visit the page and run the tests (Not recommended!!!).

We inject a little js file into your tests (we append this to qunit) so we can monitor the status
of the tests and get the results back to the server.


