import Component from '@glimmer/component';

export default class PopoverOverlayComponent extends Component {
  DEFAULT_TAG_NAME = 'div';

  constructor() {
    super(...arguments);

    let { popoverGuid } = this.args;

    if (!popoverGuid) {
      throw new Error(
        '<Popover::-Overlay /> is missing a parent <Popover /> component.'
      );
    }
  }

  get tagName() {
    return this.args.as || this.DEFAULT_TAG_NAME;
  }
}
