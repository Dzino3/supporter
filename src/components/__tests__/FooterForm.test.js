import FooterForm from '../FooterForm';
import React from "react";
import renderer from 'react-test-renderer';


describe(`FooterForm Rendering`, () => {

    test('should render FooterForm', function () {
        let tree = renderer.create(<FooterForm/>);

        expect(tree.toJSON()).toMatchSnapshot();
    });
})