declare global
{
    interface Window
    {
        tsComponents: {[name: string]: ComponentConstructor};
    }

    interface HTMLElement
    {
        tsComponents?: {[name: string]: ComponentConstructor};
    }
}

interface ComponentConstructor
{
    new (element: HTMLElement|any, options: any): any;
}

function convertToCamelCase(text: string): string
{
    return text.replace(/-([a-z])/g, (character: string) => character.charAt(1).toUpperCase());
}

function resolveData(data: string): any
{
    if (data === 'true') {
        return true;
    } else if (data === 'false') {
        return false;
    } else if (data === 'null') {
        return null;
    }

    if (data === Number(data).toString()) {
        return Number(data);
    }

    if (/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/.test(data)) {
        return JSON.parse(data);
    }

    return data;
}

function registerComponent(element: HTMLElement, name: string, options: any): void
{
    let Component = window.tsComponents[name];
    let components = element.tsComponents || {};
    components[name] = new Component(element, options);
    element.tsComponents = components;
}


if (!window.tsComponents) {
    window.tsComponents = {};
}

export function component(name: string)
{
    return (target: ComponentConstructor) => {
        window.tsComponents[name] = target;
    }
}

export function register(root: HTMLElement): void
{
    const elements = root.getElementsByTagName('*');

    for (let i = -1; i < elements.length; i++) {
        const element = i === -1 ? root : elements[i] as HTMLElement;

        if (element.nodeType !== Node.ELEMENT_NODE) {
            continue;
        }

        Array.prototype.forEach.call(element.attributes, (attribute: Attr) => {
            if (attribute.name.indexOf('data-component-') !== 0) {
                return;
            }

            const name = convertToCamelCase(attribute.name.substr(14));

            if (!window.tsComponents || !window.tsComponents[name]) {
                return;
            }

            registerComponent(element, name, resolveData(attribute.value));
        });
    }
}
