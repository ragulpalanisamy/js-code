/*
    Function to create array of particular property
*/
function pluck(array, propertyName) {
    var ret = [],
        i, ln, item;

    for (i = 0, ln = array.length; i < ln; i++) {
        item = array[i];

        ret.push(item[propertyName]);
    }

    return ret;
}