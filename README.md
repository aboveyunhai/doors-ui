# Doors UI

Some random windows OS UI experiments on web because dashboard has too many stuffs

```javascript
    import { Door, useDisclosure } from 'doors-ui';

    const App = () => {
    const disclosureProps = useDisclosure({ defaultIsOpen: true });
        return (
            <div>
                <button onClick={disclosureProps.onToggle}>open A</button>
                <Door title={'A'} disclosureProps={disclosureProps} lessThanScreen={true}>
                    content for A
                </Door>
            </div>
        );
    };
```
![screen](https://user-images.githubusercontent.com/35160613/149459492-0a9a3e55-bc77-4b73-81b0-fb5126cd8d73.gif)
