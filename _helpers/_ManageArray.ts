export class _ManageArray {




    updateArray = (objeto: any, array: any): any[] => {
        var indice = -1;
        // Recorre el array para verificar si el objeto ya existe
        for (var i = 0; i < array.length; i++) {
            if (array[i].id === objeto.id) {
                indice = i;
                break;
            }
        }

        if (indice !== -1) {
            array.splice(indice, 1);
        } else {
            array.push(objeto);
        }
        return array;
    }
}