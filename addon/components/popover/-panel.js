import Component from '@glimmer/component';

export default class PopoverPanelComponent extends Component {
  DEFAULT_TAG_NAME = 'div';

  constructor() {
    super(...arguments);

    let { popoverGuid, static: isStatic, unmount } = this.args;

    if (!popoverGuid) {
      throw new Error(
        '<Popover::-Panel /> is missing a parent <Popover /> component.'
      );
    }

    if (isStatic !== undefined && unmount !== undefined) {
      throw new Error(
        '<Popover::Panel /> cannot be passed `@static` and `@unmount` at the same time'
      );
    }
  }

  get tagName() {
    return this.args.as || this.DEFAULT_TAG_NAME;
  }
}
