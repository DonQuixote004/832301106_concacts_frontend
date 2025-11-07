# Frontend Code Style Guide

This document is based on the following industry standards:
- Google HTML/CSS Style Guide: https://google.github.io/styleguide/htmlcssguide.html
- Airbnb JavaScript Style Guide: https://github.com/airbnb/javascript

## HTML Standards
- Use HTML5 doctype: `<!DOCTYPE html>`
- Use UTF-8 character encoding: `<meta charset="UTF-8">`
- Use 2 spaces for indentation (no tabs)
- Use lowercase for element names: `<div>`, not `<DIV>`
- Always include alt attributes for images
- Use double quotes for attributes: `class="contact-item"`
- Close all HTML elements properly

## CSS Standards
- Use kebab-case for class names: `.contact-list-item`
- Use meaningful class names that describe content, not presentation
- One selector per line in multi-selector rulesets
- One declaration per line in declaration blocks
- Use shorthand properties where appropriate
- Include a space after colon in declarations: `margin: 0;`
- Group related properties together (positioning, box model, typography, etc.)

## JavaScript Standards
- Use const for variables that won't be reassigned, let for those that will
- Use single quotes for strings: `const name = 'John';`
- Use camelCase for variable and function names: `contactList`, `getContacts()`
- Use PascalCase for constructor functions or classes: `class ContactItem`
- Use === and !== instead of == and !=
- Use arrow functions for anonymous functions
- Use template literals for string concatenation: ``Hello ${name}``
- Place opening braces on the same line as the statement

## File Organization
- Place all source code in the `src/` directory
- Use descriptive file names: `contact-manager.js` instead of `script.js`
- Separate JavaScript logic from HTML structure
- Keep CSS in separate files, not inline styles