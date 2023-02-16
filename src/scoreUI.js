export class ScoreUI {
  constructor(keys, rendererKey, rendererText) {
    this.keys = keys;
    this.total = this.keys.length;
    this.rendererKey = rendererKey;
    this.rendererText = rendererText;
  }

  draw(context) {
    this.rendererText.text = `${this.total - this.keys.length}/${this.total}`;

    this.rendererText.draw(context);
    this.rendererKey.draw(context);
  }
}
