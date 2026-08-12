import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { clamp } from '../lib';

import styles from './vp-input-range.css?inline';


@customElement('vp-input-range')
export class VPInputRange extends LitElement
{
    static override styles = unsafeCSS(styles);


    private _value = 0;

    @property({ type: Number })
    set value(v: number)
    {
        if (Number.isFinite(v))
        {
            this._value = clamp(v, 0, 1);
        }
        else
        {
            this._value = 0;
        }
    }
    get value()
    {
        return this._value;
    }


    protected override render()
    {
        return html`
            <div class="_w">
                <progress max="1" value=${this.value}>${this.value * 100}%</progress>
                <input
                    type="range"

                    min="0"
                    max="1"
                    step="any"
                    value=${this.value}

                    @input=${(ev: Event) =>
                    {
                        this.value = +(ev.currentTarget as HTMLInputElement).value;
                    }}
                />
            </div>
        `;
    }
}
