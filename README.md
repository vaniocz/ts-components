# [<img alt="Vanio" src="http://www.vanio.cz/img/vanio-logo.png" width="130" align="top">](http://www.vanio.cz) TypeScript Components

[![License](https://poser.pugx.org/vanio/vanio-web-bundle/license)](https://github.com/vaniocz/vanio-web-bundle/blob/master/LICENSE)

`npm install --save vanio-ts-components`

Simple TypeScript component system.

```ts
// Hello.ts
import {component, select} from 'vanio-ts-components';

interface HelloOptions
{
    text?: string;
}

@component('HelloComponent')
export default class Hello
{
    private element: HTMLElement;

    public constructor(element: HTMLElement|string, options: HelloOptions = {})
    {
        this.element = select(element);
        this.$element.innerText = options.text || 'Hello';
    }
}
```

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset=utf-8>
</head>
<body>
    <p data-component-hello-component='{"text": "Hello world!"}'></p>
    <script src="index.js"></script>
</body>
</html>
```

```ts
// index.ts
import {register} from 'vanio-ts-components';
import 'Hello';

register(document.body);
```
