#Language Translator

## Installation

```bash
npm i text-translator
```

## Configuration
Currently AWS Translate API is supported for this package. In future, there will
be more packages like this.

You need to set environment variables:

AWS_ACCESS_KEY=<your-aws-access-key>
AWS_SECRET_KEY=<your-aws-secret-key>
REGION=<your-aws-region> (default is us-east-1)

## Basic Usage

``` ts
import { LanguageTranslateService } from 'text-translator';
const translate = new LanguageTranslateService();
translate.translate('<h1>Hi, how are you</h1>', 'fr', TextType.HTML,  TranslateProvider.AWS).then(translatedText => {
    console.log('Translated Text', translatedText);
});
```
The text type supports Plain text, Html and markdown text types.