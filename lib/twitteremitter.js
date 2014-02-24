
var Rx = require('rx'), EventEmitter = require('events').EventEmitter;

var hasOwnProp = {}.hasOwnProperty;

function createName (name) {
    return '$' + name;
}

function TwitterEmiter() {
    this.subjects = {};
}

TwitterEmiter.prototype.emit = function (name, data) {
    var fnName = createName(name);
    this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
    this.subjects[fnName].onNext(data);
};

TwitterEmiter.prototype.listen = function (name, handler) {
    var fnName = createName(name);
    this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
    return this.subjects[fName].subscribe(handler);
};

TwitterEmiter.prototype.dispose = function () {
    var subjects = this.subjects;
    for (var prop in subjects) {    
        if (hasOwnProp.call(subjects, prop)) {
            subjects[prop].dispose();
        }
    }

    this.subjects = {};
};


module.exports = TwitterEmiter;