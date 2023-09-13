# Ionic Angular Ext

Ionic is a feature-rich framework with a fair degree of customizability. This library builds common features on top of Ionic and Capacitor, trading some customizations by opinionated performant implementations.

## Entry points

### Components

#### subentries
- **Page**: Provides a common but customizable page struture, with a header on top, followed by the content. The header/toolbar contains optional elements, like side menu, title, side buttons and popover menu.
- **Filterable list**: Performant list of customizable items. Each item can have icon, title, side note, sliding options and popover options. Addition and deletion of items are implemented with predefined animations. The items are progressively rendered in order to support long lists.
- **Orderable list**: Has similar implementation to filterable list, but doesn't support options or any other task except ordering the items of the list
- **File choosing and content reading**: Integration with capacitor file system features for choosing file and read file's content
- **Document Sharing**: Allows sharing of text and image via capacitor share
- **Color picker**: Creates a simple palette with primary and secondary colors for the user to pick
- **Auth Dialog**: Provides interfaces for common authentication providers like Google and Meta
- **Modal**: A service to pre-compile a modal component for fast rendering. This had been implemented with Ionic version 6; from version 7 on, modal uses a declarative approach.

### Storage

Contains interfaces to support the use of mobile databases like SqLite and IndexedDb

#### subentries
- **platform-storage**: Supports operations in sql and nosql databases - similar to what we had with localforage - by providing interfaces to work with object stores(nosql) and tables with columns key and value(sql).
- **temporary-storage**: Allows apps to store data temporarily with ease. Uses web local storage.
- **queue**: Used to support "concurrent" transactions affecting the same store
