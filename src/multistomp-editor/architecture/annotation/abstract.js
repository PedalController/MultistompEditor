class AbstractClassError extends ErrorClass {
    constructor(classe) {
        super(`The "${classe.constructor.name}" class is abstract`);
    }
}

class AbstractMethodError extends ErrorClass {
    constructor(message) {
        super(message);
    }
}

function abstract(target, name, descriptor) {
    let isMethod = descriptor !== undefined && descriptor.value !== undefined;

    if (isMethod)
        descriptor.value = function() {
            if (this.constructor.name == target.constructor.name)
                throw new AbstractMethodError(`The method "${name}" of "${target.constructor.name}" is abstract`);
            else
                throw new AbstractMethodError(`The method "${name}" of "${this.constructor.name}" is a "${target.constructor.name}" abstract method. It must be implemented`);
        };

    return descriptor;
}
