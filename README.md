# @1schoolone/ui React Components Library

## Overview

This is a shared React component library based on Ant Design, designed to streamline development across multiple projects within SchoolOne. It provides a set of reusable, customized components that adhere to our design system and coding standards.

## Installation

To install the library in your project, run:

```bash
npm install @1schoolone/ui
```

or if you're using yarn:

```bash
yarn add @1schoolone/ui
```

## Usage

Import components from the library in your React application:

```jsx
import { Button, Card, Table } from '@myteam/react-components'

function MyComponent() {
 return (
  <div>
   <Button type="primary">Click me</Button>
   <Card title="My Card">
    <p>Card content</p>
   </Card>
   <Table dataSource={myData} columns={myColumns} />
  </div>
 )
}
```

## Available Components

Our library includes the following components:

- Table
- _More to come..._

~~For detailed documentation on each component, please refer to our Storybook.~~

## Customization

While our components are based on Ant Design, we've customized them to fit our specific needs. You can further customize these components using our theme variables:

```jsx
import { ThemeProvider } from '@1schoolone/ui'

function App() {
 return <ThemeProvider theme={yourCustomTheme}>{/* Your app code */}</ThemeProvider>
}
```

## Contributing

We welcome contributions from team members. Please follow these steps:

1. Clone the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and write tests if necessary
4. Submit a pull request for review

## Development

To set up the development environment:

1. Clone the repository
2. Run `yarn install`
3. Start the development server with or `yarn storybook`

## Testing

Run tests with:

```bash
yarn test
```

## Building

To build the library for production:

```bash
yarn build
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

For any questions or issues, please contact the maintainers or open an issue in the repository.
