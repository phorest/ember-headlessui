import { module, test, todo } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, setupOnerror } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

const PopoverState = {
  Visible: 'visible',
  InvisibleHidden: 'invisible-hidden',
  InvisibleUnmounted: 'invisible-unmounted',
};

function assertPopoverButton(assert, button, options = {}) {
  if (button === null) {
    assert.notEqual(button, null, 'Popover.Button does not exist');
    return;
  }

  assert
    .dom(button)
    .hasAttribute('id', /-headlessui-popover-button$/, 'Popover.Button has id');

  switch (options.state) {
    case PopoverState.Visible: {
      assert.dom(button).hasAttribute('aria-controls');
      assert.dom(button).hasAttribute('aria-expanded', 'true');
      break;
    }

    case PopoverState.InvisibleHidden: {
      assert.dom(button).hasAttribute('aria-controls');
      assert.dom(button).doesNotHaveAttribute('aria-expanded');
      break;
    }

    case PopoverState.InvisibleUnmounted: {
      assert.dom(button).doesNotHaveAttribute('aria-controls');
      assert.dom(button).doesNotHaveAttribute('aria-expanded');
      break;
    }

    default:
      assert.ok(false);
  }

  if (options.textContent) {
    assert
      .dom(button)
      .hasText(options.textContent, 'Popover.Button contains content');
  }

  if (options.attributes) {
    for (let attributeName in options.attributes) {
      assert
        .dom(button)
        .hasAttribute(attributeName, options.attributes[attributeName]);
    }
  }
}

function assertHidden(assert, element) {
  if (element === null) {
    assert.notEqual(element, null, 'Element does not exist');
    return;
  }

  assert.dom(element).hasAttribute('hidden');
  assert.dom(element).hasStyle({ display: 'none' });
}

function assertVisible(assert, element) {
  if (element === null) {
    assert.notEqual(element, null, 'Element does not exist');
    return;
  }

  assert.dom(element).doesNotHaveAttribute('hidden');
  assert.dom(element).doesNotHaveStyle({ display: 'none' });
}

function assertPopoverPanel(assert, panel, options = {}) {
  switch (options.state) {
    case PopoverState.InvisibleHidden: {
      if (panel === null) {
        assert.notEqual(panel, null, 'Popover.Panel does not exist');
        return;
      }

      assertHidden(assert, panel);

      if (options.textContent) {
        assert
          .dom(panel)
          .hasText(options.textContent, 'Popover.Panel contains content');
      }

      if (options.attributes) {
        for (let attributeName in options.attributes) {
          assert
            .dom(panel)
            .hasAttribute(attributeName, options.attributes[attributeName]);
        }
      }

      break;
    }

    case PopoverState.Visible: {
      if (panel === null) {
        assert.notEqual(panel, null, 'Popover.Panel does not exist');
        return;
      }

      assertVisible(assert, panel);

      if (options.textContent) {
        assert
          .dom(panel)
          .hasText(options.textContent, 'Popover.Panel contains content');
      }

      if (options.attributes) {
        for (let attributeName in options.attributes) {
          assert
            .dom(panel)
            .hasAttribute(attributeName, options.attributes[attributeName]);
        }
      }

      break;
    }

    case PopoverState.InvisibleUnmounted: {
      assert.equal(panel, null, 'Popover.Panel does not exist');
      break;
    }
  }
}

module('Integration | Component | <Popover>', function (hooks) {
  setupRenderingTest(hooks);

  module('Safe guards', function () {
    test('it should error when we are using a <Popover::-Button /> without a parent <Popover />', async function (assert) {
      setupOnerror(function (err) {
        assert.equal(
          err.message,
          '<Popover::-Button /> is missing a parent <Popover /> component.',
          'Throw initialization error'
        );
      });

      await render(hbs`<Popover::-Button/>`);
    });

    test('it should error when we are using a <Popover::-Panel /> without a parent <Popover />', async function (assert) {
      setupOnerror(function (err) {
        assert.equal(
          err.message,
          '<Popover::-Panel /> is missing a parent <Popover /> component.',
          'Throw initialization error'
        );
      });

      await render(hbs`<Popover::-Panel/>`);
    });

    test('it should error when we are using a <Popover::-Overlay /> without a parent <Popover />', async function (assert) {
      setupOnerror(function (err) {
        assert.equal(
          err.message,
          '<Popover::-Overlay /> is missing a parent <Popover /> component.',
          'Throw initialization error'
        );
      });

      await render(hbs`<Popover::-Overlay/>`);
    });

    test('it should error when a panel is passed both `static` and `unmount`', async function (assert) {
      setupOnerror(function (err) {
        assert.equal(
          err.message,
          '<Popover::Panel /> cannot be passed `@static` and `@unmount` at the same time',
          'Throw initialization error'
        );
      });

      await render(hbs`
        <Popover as |p|>
          <p.Button>Trigger</p.Button>
          <p.Panel @static={{true}} @unmount={{true}}>Contents</p.Panel>
        </Popover>
      `);
    });

    test('it should be possible to render a Popover without crashing', async function (assert) {
      await render(hbs`
        <Popover as |p|>
          <p.Button>Trigger</p.Button>
          <p.Panel>Contents</p.Panel>
        </Popover>
      `);

      let popoverButton = this.element.querySelector(
        '[id$="-headlessui-popover-button"]'
      );

      assertPopoverButton(assert, popoverButton, {
        state: PopoverState.InvisibleUnmounted,
        attributes: { id: /-headlessui-popover-button$/ },
      });

      let popoverPanel = this.element.querySelector(
        '[id$="-headlessui-popover-panel"]'
      );

      assertPopoverPanel(assert, popoverPanel, {
        state: PopoverState.InvisibleUnmounted,
      });
    });
  });

  module('Rendering', function () {
    module('Popover.Group', function () {
      todo(
        'it should be possible to render a Popover.Group with multiple Popover components',
        async function () {}
      );
    });

    module('Popover', function () {
      test('it should be possible to render a Popover using a render prop', async function (assert) {
        await render(hbs`
          <Popover as |p|>
            <p.Button>Trigger</p.Button>
            <p.Panel>Panel is: {{if p.open "open" "closed"}}</p.Panel>
          </Popover>
        `);

        let popoverButton = this.element.querySelector(
          '[id$="-headlessui-popover-button"]'
        );

        assertPopoverButton(assert, popoverButton, {
          state: PopoverState.InvisibleUnmounted,
          attributes: { id: /headlessui-popover-button$/ },
        });

        let popoverPanel = this.element.querySelector(
          '[id$="-headlessui-popover-panel"]'
        );

        assertPopoverPanel(assert, popoverPanel, {
          state: PopoverState.InvisibleUnmounted,
        });

        await click(popoverButton);

        popoverButton = this.element.querySelector(
          '[id$="-headlessui-popover-button"]'
        );

        assertPopoverButton(assert, popoverButton, {
          state: PopoverState.Visible,
          attributes: { id: /headlessui-popover-button$/ },
        });

        popoverPanel = this.element.querySelector(
          '[id$="-headlessui-popover-panel"]'
        );

        assertPopoverPanel(assert, popoverPanel, {
          state: PopoverState.Visible,
          textContent: 'Panel is: open',
        });
      });
    });

    module('Popover.Button', function () {
      test('it should be possible to render a Popover.Button using a render prop', async function (assert) {
        await render(hbs`
          <Popover as |p|>
            <p.Button>{{p.open}}</p.Button>
            <p.Panel></p.Panel>
          </Popover>
        `);

        let popoverButton = this.element.querySelector(
          '[id$="-headlessui-popover-button"]'
        );

        assertPopoverButton(assert, popoverButton, {
          state: PopoverState.InvisibleUnmounted,
          attributes: { id: /headlessui-popover-button$/ },
          textContent: 'false',
        });

        let popoverPanel = this.element.querySelector(
          '[id$="-headlessui-popover-panel"]'
        );

        assertPopoverPanel(assert, popoverPanel, {
          state: PopoverState.InvisibleUnmounted,
        });

        await click(popoverButton);

        popoverButton = this.element.querySelector(
          '[id$="-headlessui-popover-button"]'
        );

        assertPopoverButton(assert, popoverButton, {
          state: PopoverState.Visible,
          attributes: { id: /headlessui-popover-button$/ },
          textContent: 'true',
        });

        popoverPanel = this.element.querySelector(
          '[id$="-headlessui-popover-panel"]'
        );

        assertPopoverPanel(assert, popoverPanel, {
          state: PopoverState.Visible,
        });
      });

      test('it should be possible to render a Popover.Button using a render prop and an `as` prop', async function (assert) {
        await render(hbs`
          <Popover @as="div" role="button" as |p|>
            <p.Button>{{p.open}}</p.Button>
            <p.Panel></p.Panel>
          </Popover>
        `);

        let popoverButton = this.element.querySelector(
          '[id$="-headlessui-popover-button"]'
        );

        assertPopoverButton(assert, popoverButton, {
          state: PopoverState.InvisibleUnmounted,
          attributes: { id: /headlessui-popover-button$/ },
          textContent: 'false',
        });

        let popoverPanel = this.element.querySelector(
          '[id$="-headlessui-popover-panel"]'
        );

        assertPopoverPanel(assert, popoverPanel, {
          state: PopoverState.InvisibleUnmounted,
        });

        await click(popoverButton);

        popoverButton = this.element.querySelector(
          '[id$="-headlessui-popover-button"]'
        );

        assertPopoverButton(assert, popoverButton, {
          state: PopoverState.Visible,
          attributes: { id: /headlessui-popover-button$/ },
          textContent: 'true',
        });

        popoverPanel = this.element.querySelector(
          '[id$="-headlessui-popover-panel"]'
        );

        assertPopoverPanel(assert, popoverPanel, {
          state: PopoverState.Visible,
        });
      });
    });

    module('Popover.Panel', function () {
      test('it should be possible to render Popover.Panel using a render prop', async function (assert) {
        await render(hbs`
          <Popover as |p|>
            <p.Button>Trigger</p.Button>
            <p.Panel>{{p.open}}</p.Panel>
          </Popover>
        `);

        let popoverButton = this.element.querySelector(
          '[id$="-headlessui-popover-button"]'
        );

        assertPopoverButton(assert, popoverButton, {
          state: PopoverState.InvisibleUnmounted,
          attributes: { id: /headlessui-popover-button$/ },
        });

        let popoverPanel = this.element.querySelector(
          '[id$="-headlessui-popover-panel"]'
        );

        assertPopoverPanel(assert, popoverPanel, {
          state: PopoverState.InvisibleUnmounted,
        });

        await click(popoverButton);

        popoverButton = this.element.querySelector(
          '[id$="-headlessui-popover-button"]'
        );

        assertPopoverButton(assert, popoverButton, {
          state: PopoverState.Visible,
          attributes: { id: /headlessui-popover-button$/ },
        });

        popoverPanel = this.element.querySelector(
          '[id$="-headlessui-popover-panel"]'
        );

        assertPopoverPanel(assert, popoverPanel, {
          state: PopoverState.Visible,
          textContent: 'true',
        });
      });

      test('it should be possible to always render the Popover.Panel if we provide it a `static` prop', async function (assert) {
        await render(hbs`
          <Popover as |p|>
            <p.Button>Trigger</p.Button>
            <p.Panel @static={{true}}>Contents</p.Panel>
          </Popover>
        `);

        assert.dom('[id$="-headlessui-popover-panel"]').exists();
      });

      todo(
        'it should be possible to use a different render strategy for the Popover.Panel',
        async function () {}
      );

      todo(
        'it should be possible to move the focus inside the panel to the first focusable element (very first link)',
        async function () {}
      );

      todo(
        'it should close the Popover, when Popover.Panel has the focus prop and you focus the open button',
        async function () {}
      );

      todo(
        'it should be possible to move the focus inside the panel to the first focusable element (skip hidden link)',
        async function () {}
      );

      todo(
        'it should be possible to move the focus inside the panel to the first focusable element (very first link) when the hidden render strategy is used',
        async function () {}
      );
    });
  });

  module('Composition', function () {
    todo(
      'it should be possible to wrap the Popover.Panel with a Transition component',
      async function () {}
    );
  });

  module('Keyboard interactions', function () {
    module('`Enter` key', function () {
      todo(
        'it should be possible to open the Popover with Enter',
        async function () {}
      );

      todo(
        'it should not be possible to open the popover with Enter when the button is disabled',
        async function () {}
      );

      todo(
        'it should be possible to close the popover with Enter when the popover is open',
        async function () {}
      );

      todo(
        'it should close other popover menus when we open a new one',
        async function () {}
      );

      todo(
        'it should close the Popover by pressing `Enter` on a Popover.Button inside a Popover.Panel',
        async function () {}
      );
    });

    module('`Escape` key', function () {
      todo(
        'it should close the Popover menu, when pressing escape on the Popover.Button',
        async function () {}
      );

      todo(
        'it should close the Popover menu, when pressing escape on the Popover.Panel',
        async function () {}
      );

      todo(
        'it should be possible to close a sibling Popover when pressing escape on a sibling Popover.Button',
        async function () {}
      );
    });

    module('`Tab` key', function () {
      todo(
        'it should be possible to Tab through the panel contents onto the next Popover.Button',
        async function () {}
      );

      todo(
        'it should be possible to place a focusable item in the Popover.Group, and keep the Popover open when we focus the focusable element',
        async function () {}
      );

      todo(
        'it should close the Popover menu once we Tab out of the Popover.Group',
        async function () {}
      );

      todo(
        'it should close the Popover menu once we Tab out of the Popover',
        async function () {}
      );

      todo(
        'it should close the Popover when the Popover.Panel has a focus prop',
        async function () {}
      );

      todo(
        'it should close the Popover when the Popover.Panel has a focus prop (Popover.Panel uses a Portal)',
        async function () {}
      );

      todo(
        'it should close the Popover when the Popover.Panel has a focus prop (Popover.Panel uses a Portal), and focus the next focusable item in line',
        async function () {}
      );
    });

    module('`Shift+Tab` key', function () {
      todo(
        'it should close the Popover menu once we Tab out of the Popover.Group',
        async function () {}
      );

      todo(
        'it should close the Popover menu once we Tab out of the Popover',
        async function () {}
      );

      todo(
        'it should focus the previous Popover.Button when Shift+Tab on the second Popover.Button',
        async function () {}
      );

      todo(
        'it should focus the Popover.Button when pressing Shift+Tab when we focus inside the Popover.Panel',
        async function () {}
      );

      todo(
        'it should focus the Popover.Button when pressing Shift+Tab when we focus inside the Popover.Panel (inside a Portal)',
        async function () {}
      );

      todo(
        'it should be possible to focus the last item in the Popover.Panel when pressing Shift+Tab on the next Popover.Button',
        async function () {}
      );

      todo(
        'it should be possible to focus the last item in the Popover.Panel when pressing Shift+Tab on the next Popover.Button (using Portals)',
        async function () {}
      );
    });

    module('`Space` key', function () {
      todo(
        'it should be possible to open the popover with Space',
        async function () {}
      );

      todo(
        'it should not be possible to open the popover with Space when the button is disabled',
        async function () {}
      );

      todo(
        'it should be possible to close the popover with Space when the popover is open',
        async function () {}
      );

      todo(
        'it should close other popover menus when we open a new one',
        async function () {}
      );

      todo(
        'it should close the Popover by pressing `Space` on a Popover.Button inside a Popover.Panel',
        async function () {}
      );
    });
  });

  module('Mouse interactions', function () {
    todo(
      'it should be possible to open a popover on click',
      async function () {}
    );

    todo(
      'it should not be possible to open a popover on right click',
      async function () {}
    );

    todo(
      'it should not be possible to open a popover on click when the button is disabled',
      async function () {}
    );

    todo(
      'it should be possible to close a popover on click',
      async function () {}
    );

    todo(
      'it should be possible to close a Popover using a click on the Popover.Overlay',
      async function () {}
    );

    todo(
      'it should be possible to close the popover, and re-focus the button when we click outside on the body element',
      async function () {}
    );

    todo(
      'it should be possible to close the popover, and re-focus the button when we click outside on a non-focusable element',
      async function () {}
    );

    todo(
      'it should be possible to close the popover, by clicking outside the popover on another focusable element',
      async function () {}
    );

    todo(
      'it should be possible to close the popover, by clicking outside the popover on another element inside a focusable element',
      async function () {}
    );

    todo(
      'it should be possible to close the Popover by clicking on a Popover.Button inside a Popover.Panel',
      async function () {}
    );
  });
});
