import {Has} from "../../utils";

/**
 *
 * @param elements {Array<{text: string}>}
 */
const Accordion = ({elements}) => {

    const hasAtLeastOneElement = Has.Elements(elements) && Has.Text(elements[0].text);

    return hasAtLeastOneElement &&  (
        elements.map((element, index) => <p key={index}>
            {element.text}
        </p>)
    )
}

export default Accordion;