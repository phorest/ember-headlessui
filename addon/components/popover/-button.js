import Component from '@glimmer/component';

export default class PopoverButtonComponent extends Component {
  DEFAULT_TAG_NAME = 'button';

  constructor() {
    super(...arguments);

    let { popoverGuid } = this.args;

    if (!popoverGuid) {
      throw new Error(
        '<Popover::-Button /> is missing a parent <Popover /> component.'
      );
    }
  }

  get tagName() {
    return this.args.as || this.DEFAULT_TAG_NAME;
  }
}
