import { has } from '../util/has';

export interface Styles {
    [name: string]: any;
}

export class Style {
    constructor(public styles: Styles[] = [], public head = styles.length) { }

    fork(...styles: (Styles | undefined)[]) {
        let ret: Style = this;
        for (let i = 0; i < styles.length; i++) {
            const styleSheet = styles[i];
            if (styleSheet !== undefined) {
                if (ret === this)
                    ret = ret.clone();
                ret.push(styleSheet);
            }
        }
        return ret;
    }

    clone() {
        return new Style(this.styles, this.head);
    }

    push(styles: Styles) {
        this.styles[this.head++] = styles;
    }

    get(key: string) {
        return this.find(key)?.[key];
    }

    pick(keys: string[]) {
        const ret: Styles = {};
        if (Array.isArray(keys)) {
            for (let i = 0; i < keys.length; i++)
                this.copy(ret, keys[i]);
        }
        else
            this.copy(ret, keys);
        return ret;
    }

    find(key: string) {
        let next = this.head;
        while (next-- > 0) {
            const style = this.styles[next];
            if (has(style, key))
                return style;
        }
    }

    copy(ret: Styles, key: string) {
        const style = this.find(key);
        if (style !== undefined)
            ret[key] = style[key];
    }
}
