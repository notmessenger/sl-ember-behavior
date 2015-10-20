import Ember from 'ember';
import ComponentMixin from 'sl-ember-behavior/mixins/component';
import { module, test } from 'qunit';
import sinon from 'sinon';

let AugmentedObject;
let isViewableStub;

module( 'Unit | Mixin | component', {
    beforeEach() {
        isViewableStub = sinon.stub().returns( true );

        AugmentedObject = Ember.Object.extend( ComponentMixin, {
            isViewable: isViewableStub
        });
    }
});

test( 'Default property values are set correctly', function( assert ) {
    const subject = AugmentedObject.create();

    assert.strictEqual(
        subject.behaviorService.name,
        'sl-behavior',
        'service: "sl-behavior"'
    );

    assert.strictEqual(
        subject.get( 'tagName' ),
        'span',
        'tagName: "span"'
    );

    assert.strictEqual(
        subject.get( 'possible' ),
        true,
        'possible: true'
    );
});

test( 'Dependent keys are correct', function( assert ) {
    AugmentedObject = Ember.Object.extend( ComponentMixin );

    const subject = AugmentedObject.create();

    const showContentDependentKeys = [
        'behaviorService.behaviors',
        'possible'
    ];

    assert.deepEqual(
        subject.showContent._dependentKeys,
        showContentDependentKeys,
        'Dependent keys are correct for showContent()'
    );
});

test( 'Assert is thrown when isViewable() is not implemented on the derived class', function( assert ) {
    AugmentedObject = Ember.Object.extend( ComponentMixin );

    const subject = AugmentedObject.create();

    assert.throws(
        subject.isViewable,
        'Assertion was thrown'
    );
});

test( 'isViewable() returns false when not implemented on the derived class', function( assert ) {
    AugmentedObject = Ember.Object.extend( ComponentMixin );

    const originalEmberAssert = Ember.assert;
    const subject = AugmentedObject.create();

    Ember.assert = function() {};

    assert.strictEqual(
        subject.isViewable(),
        false,
        'isViewable() returns false when not overriden'
    );

    Ember.assert = originalEmberAssert;
});

test( 'showContent() computed property throws assertion when `possible` property is not a boolean', function( assert ) {
    const subject = AugmentedObject.create();
    const callShowContent = () => subject.get( 'showContent' );

    // Array
    subject.set( 'possible', [] );

    assert.throws(
        callShowContent,
        'The `possible` property is an Array'
    );

    // Function
    subject.set( 'possible', () => {} );

    assert.throws(
        callShowContent,
        'The possible property is a Function'
    );

    // Instance
    subject.set( 'possible', Ember.Object.create() );

    assert.throws(
        callShowContent,
        'The possible property is an Instance'
    );

    // Null
    subject.set( 'possible', null );

    assert.throws(
        callShowContent,
        'The `possible` property is Null'
    );

    // Number
    subject.set( 'possible', 123 );

    assert.throws(
        callShowContent,
        'The `possible` property is a Number'
    );

    // Object
    subject.set( 'possible', {} );

    assert.throws(
        callShowContent,
        'The `possible` property is an Object'
    );

    // Undefined
    subject.set( 'possible', undefined );

    assert.throws(
        callShowContent,
        'The `possible` property is Undefined'
    );

    // Boolean
    subject.set( 'possible', true );

    assert.ok(
        callShowContent(),
        'The `possible` property is a Boolean'
    );
});

test( 'showContent() computed property returns the value the isViewable method returns', function( assert ) {
    let subject = AugmentedObject.create();

    assert.strictEqual(
        subject.get( 'showContent' ),
        true,
        'Is viewable returns true'
    );

    AugmentedObject.reopen({
        isViewable: sinon.stub().returns( false )
    });

    subject = AugmentedObject.create();

    assert.strictEqual(
        subject.get( 'showContent' ),
        false,
        'Is viewable returns false'
    );
});
