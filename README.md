# Doors UI

Some random windows OS UI experience on web because dashboard has too many stuffs

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