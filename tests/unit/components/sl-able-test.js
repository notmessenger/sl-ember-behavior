import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import sinon from 'sinon';
import componentMixin from 'sl-ember-behavior/mixins/component';

let behaviorService;

moduleForComponent( 'sl-able', 'Unit | Component | sl able', {
    unit: true,

    beforeEach() {
        behaviorService = Ember.Object.create({
            isAble: sinon.stub().returns( true )
        });
    }
});

test( 'Successfully mixed component', function( assert ) {
    assert.ok(
        componentMixin.detect( this.subject() )
    );
});

/**
 * Ensures that the template is wrapping the content in a span tag and not in
 * any block-level tags. While it appears that core Ember functionality is being
 * tested this test is ensuring that the implied contract about how this non-UI
 * component is rendered into the DOM is adhered to.
 */
test( 'Renders as a span tag with no classes', function( assert ) {
    this.subject({
        behaviorService: behaviorService
    });

    assert.strictEqual(
        this.$().prop( 'tagName' ),
        'SPAN'
    );
});

test( 'isAble() calls isAble() on the behavior service', function( assert ) {
    this.subject({
        behaviorService: behaviorService,
        activity: 'anActivity',
        resource: 'aResource',
        possible: true
    });

    this.render();

    assert.ok(
        behaviorService.isAble.withArgs( 'anActivity', 'aResource', true ).calledOnce,
        'isAble() was called with the correct params'
    );
});

test( 'Is responsive to changes in the behavior data on the service', function( assert ) {
    this.subject({
        behaviorService: behaviorService,
        activity: 'anActivity',
        resource: 'aResource'
    });

    this.render();

    Ember.run( () => {
        behaviorService.set( 'behaviors', {
            'aResource': {
                'anActivity': false
            }
        });
    });

    assert.ok(
        behaviorService.isAble.withArgs( 'anActivity', 'aResource', true ).calledTwice,
        'isAble() is called twice'
    );
});

test( 'Is responsive to changes to the `possible` parameter', function( assert ) {
    const component = this.subject({
        behaviorService: behaviorService,
        activity: 'anActivity',
        resource: 'aResource'
    });

    this.render();

    assert.ok(
        behaviorService.isAble.withArgs( 'anActivity', 'aResource', true ).calledOnce,
        'isAble() is called with `true` as a third param'
    );

    Ember.run( function() {
        component.set( 'possible', false );
    });

    assert.ok(
        behaviorService.isAble.withArgs( 'anActivity', 'aResource', false ).calledOnce,
        'isAble() is called with `false` as a third param'
    );
});
