import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PopoverComponent extends Component {
  DEFAULT_TAG_NAME = 'div';

  guid = `${guidFor(this)}-headlessui-popover`;

  @tracked open = false;

  get tagName() {
    return this.args.as || this.DEFAULT_TAG_NAME;
  }

  get buttonGuid() {
    return `${this.guid}-button`;
  }

  get panelGuid() {
    return `${this.guid}-panel`;
  }

  get overlayGuid() {
    return `${this.guid}-overlay`;
  }

  @action
  handleButtonClick() {
    this.open = !this.open;
  }
}
