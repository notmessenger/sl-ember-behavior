import Ember from 'ember';
import mixinUnderTest from 'sl-ember-behavior/mixins/route';
import { module, test } from 'qunit';

let Mixin;

module( 'Unit | Mixin | route', {
    beforeEach() {
        Mixin = Ember.Route.extend( mixinUnderTest );
        Mixin = Mixin.create();
    }
});

test( 'The correct service is being injected into the mixin', function( assert ) {
    assert.strictEqual(
        Mixin.behaviorService.name,
        'sl-behavior',
        'The correct service is being injected into the mixin'
    );
});

// Though appears to be a duplicate of the module.setup() call this is an actual test,
// whereas the other is configuration and might change in the future
test( 'Successfully mixed', function( assert ) {
    const testObject = Ember.Route.extend( mixinUnderTest );
    const subject = testObject.create();

    assert.ok(
        subject
    );
});

test( '"unableRoute" property defaults to null', function( assert ) {
    assert.strictEqual(
        Mixin.get( 'unableRoute' ),
        null
    );
});

test( '_super() is called with transition.targetName as argument value', function( assert ) {
    const testStringValue = 'test value';

    const transition = {};
    transition.targetName = testStringValue;

    let superArgs;
    Ember.set( Mixin, '_super', function( value ) {
        superArgs = value;
    });

    Mixin.behaviorService = {
        isUnable() {}
    };

    Mixin.beforeModel( transition );

    assert.ok(
        superArgs,
        transition
    );
});

test( 'Call to isUnable() uses transition.targetName as first argument value', function( assert ) {
    const testStringValue = 'test value';

    const transition = {};
    transition.targetName = testStringValue;

    let parameterValuePassed;
    Mixin.behaviorService = {
        isUnable( value1 ) {
            parameterValuePassed = value1;
        }
    };

    Mixin.beforeModel( transition );

    assert.ok(
        testStringValue,
        parameterValuePassed
    );
});

test( 'Call to isUnable() uses "route" as second argument value', function( assert ) {
    const transition = {};
    transition.targetName = 'test';

    let hardCodedValue;
    Mixin.behaviorService = {
        isUnable( value1, value2 ) {
            hardCodedValue = value2;
        }
    };

    Mixin.beforeModel( transition );

    assert.ok(
        'route',
        hardCodedValue
    );
});

test( 'If isUnable() and "unableRoute" is null, transition.abort() is called', function( assert ) {
    const transition = {};
    transition.targetName = 'test';

    let iWasCalled = false;
    transition.abort = function() {
        iWasCalled = true;
    };

    Mixin.behaviorService = {
        isUnable: function() {
            return true;
        }
    };

    Mixin.beforeModel( transition );

    assert.ok(
        iWasCalled,
        'transition.abort() was called'
    );
});

test(
    'If isUnable() and "unableRoute" is not null, transitionTo() is called with "unableRoute" value',
    function( assert ) {
        Mixin.unableRoute = 'notEmpty';

        const transition = {};
        transition.targetName = 'test';

        let routeToTransitionTo;
        Mixin.transitionTo = function( value ) {
            routeToTransitionTo = value;
        };

        Mixin.behaviorService = {
            isUnable: function() {
                return true;
            }
        };

        Mixin.beforeModel( transition );

        assert.ok(
            routeToTransitionTo,
            'notEmpty'
        );
    }
);

test( 'If not isUnable() then beforeModel() introduces no varying code path', function( assert ) {
    Mixin.unableRoute = 'notEmpty';

    const transition = {};
    transition.targetName = 'test';

    let abortWasCalled = false;
    transition.abort = function() {
        abortWasCalled = true;
    };

    let transitionWasCalled = false;
    Mixin.transitionTo = function() {
        transitionWasCalled = true;
    };

    Mixin.behaviorService = {
        isUnable: function() {
            return false;
        }
    };

    Mixin.beforeModel( transition );

    assert.ok(
        !( abortWasCalled || transitionWasCalled ),
        'There is no varying code path'
    );
});
