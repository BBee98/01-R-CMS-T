export const Has = {
    Text,
    Elements
}

function Text(text){
    return text.length > !!text;
}

function Elements(elements){
    return Array.isArray(elements) && elements.length > 0;
}