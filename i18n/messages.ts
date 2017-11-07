export default {
    it: {
        add: {
            buttons: {
                confirm: 'Aggiungi',
                close: 'Chiudi'
            },
            title: 'Nuovo Elemento'
        },
        delete: {
            buttons: {
                confirm: 'Elimina',
                close: 'Annulla'
            },
            content: `ATTENZIONE! Verranno eliminati gli elementi e tutti i riferimenti collegati.<br><b>L'operazione non è reversibile</b>`,
            title: 'Vuoi eliminare gli elementi selezionati?',
        },
        errors: {
            general: {
                buttons: {
                    close: 'Chiudi'
                },
                content: 'Si è verificato un errore, riprovare.',
                title: 'Errore'
            }
        },
        search: {
            fields : {
                main: 'Ricerca'
            }
        },
        single_delete: {
            buttons: {
                close: 'Annulla',
                confirm: 'Elimina'
            },
            content: `ATTENZIONE! Verrà eliminato l'elemento e tutti i suoi riferimenti collegati.<br><b>L'operazione non è reversibile</b>`,
            title: 'Vuoi eliminare l\'elemento?'
        },
        table: {
            no_data_text: 'Nessun dato disponibile',
            no_results_text: 'Nessun record trovato',
            row_per_page_items: {
                all: 'Tutti'
            },
            row_per_page_text: 'Righe per pagina:'
        }
    },
    en: {
        add: {
            buttons: {
                confirm: 'Add',
                close: 'Close'
            },
            title: 'New Element'
        },
        delete: {
            buttons: {
                confirm: 'Delete',
                close: 'Close'
            },
            content: `ATTENTION! All elements and reference will be deleted.<br><b>You cannot undo the operation.</b>`,
            title: 'Do you want to delete the selected elements?',
        },
        errors: {
            general: {
                buttons: {
                    close: 'Close'
                },
                content: 'An error occured.Try again.',
                title: 'Error'
            }
        },
        search: {
            fields : {
                main: 'Search'
            }
        },
        single_delete: {
            buttons: {
                close: 'Close',
                confirm: 'Delete'
            },
            content: `ATTENTION! The element and all its references will be deleted.<br><b>You cannot undo the operation.</b>`,
            title: 'Do you want to delete the element?'
        },
        table: {
            no_data_text: 'No data available',
            no_results_text: 'No record found',
            row_per_page_items: {
                all: 'All'
            },
            row_per_page_text: 'row for page:'
        }
    }
}