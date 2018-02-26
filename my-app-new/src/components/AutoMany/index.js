import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import './style.css';


const vehicles = [
{
        make: 'Tesla',
        vehicles: [
            {
                model: 'Model S',
            },

            {
                model: 'Model X',
            }



        ]
},

{
        make: 'Alfa Romeo',
        vehicles: [
            {
                model: '4C',
            },

            {
                model: '4C Spider',
            },

            {
                model: 'Giulia',
            }
        ]
},

{
        make: 'Audi',
        vehicles: [
            {
                model: 'A4',
            },

            {
                model: 'A5',
            },

            {
                model: 'A6',
            },

            {
                model: 'A7',
            },

            {
                model: 'A8',
            },

            {
                model: 'S3',
            },

            {
                model: 'S5',
            },

            {
                model: 'S6',
            },

            {
                model: 'S7',
            },

            {
                model: 'S8',
            },

            {
                model: 'TT',
            },

            {
                model: 'TTS',
            }

        ]
},

{
        make: 'Ferrari',
        vehicles: [
            {
                model: 'Enzo',
            },

            {
                model: 'Dino'
            }, 

            {
                model: '458 Italia'
            }, 

            { 
                model: 'Spider'
            }
        ]
},

{
        make: 'Renault',
        vehicles: [
            {
                model: 'Trafic',
            },

            {
                model: 'Twingo',
            },

            {
                model: 'Clio',
            },

            {
                model: 'Captur',
            },

            {
                model: 'Megane',
            },

            {
                model: 'Kadjar',
            },

            {
                model: 'Grand Scenic',
            },

            {
                model: 'Koleos',
            }
        ]

},

{
        make: 'Toyota',
        vehicles: [
            {
                model: 'Supra',
            },

            {
                model: 'Highlander',
            }, 

            {
                model: 'Yaris',
            }, 

            {
                model: 'Auris',
            },

            {
                model: 'C-HR',
            },

            {
                model: 'Verso',
            },

            {
                model: 'Prius',
            },

            {
                model: 'RAV4'
            }
        ]
},

{
        make: 'Lexus',
        vehicles: [
            {
                model: 'CT 200H',
            },

            {
                model: 'ES 300H',
            },

            {
                model: 'ES 350',
            },

            {
                model: 'GS 200t',
            },

            {
                model: 'GS F',
            },

            {
                model: 'RC 200t',
            }, 

            {
                model: 'RX 450h',
            }
        ]
},

{

        make: 'Hyundai',
        vehicles: [
            {
                model: 'i10',
            },

            {
                model: 'i20',
            },

            {
                model: 'ix20',
            },

            {
                model: 'i30',
            },

            {
                model: 'Tucson',
            },

            {
                model: 'IONIQ',
            },

            {
                model: 'Kona',
            }


        ]


},

{
        make: 'Mazda',
        vehicles: [
            {
                model: 'CX-3',
            },

            {
                model: 'CX-5',
            },

            {
                model: 'CX-9',
            }, 

            {
                model: 'MX-5 Miata'
            },

            {
                model: 'MX-5 Miata RF',
            },

            {
                model: 'Mazda 3',
            },

            {
                model: 'Mazda 6',
            }

        ]

},

{

        make: 'Seat',
        vehicles: [
            {
                model: 'Ibiza',
            },

            {
                model: 'Leon',
            },

            {
                model: 'Arona',
            },

            {
                model: 'Ateca',
            },

            {
                model: 'Alhambra',
            }
        ]


},

{
        make: 'BMW',
        vehicles: [
            {
                model: '1 Series',
            },

            {
                model: '2 Series',
            },

            {
                model: '3 Series',
            }, 

            {
                model: 'X1',
            }
        ]


},

{
        make: 'Skoda',
        vehicles: [
            {
                model: 'Citigo',
            },

            {
                model: 'Fabia',
            },

            {
                model: 'Rapid',
            },

            {
                model: 'Rapid Spaceback',
            },

            {
                model: 'Octavia',
            },

            {
                model: 'Karoq',
            },

            {
                model: 'Superb',
            },

            {
                model: 'Kodiaq',
            }, 

            {
                model: 'Fortwo',
            }, 

            {
                model: 'ForFour',
            },


        ]
},

{

        make: 'Ford', 
        vehicles: [
            {
                model: 'Focus',
            }, 

            {
                model: 'Fusion',
            },

            {
                model: 'Mustang',
            },

            {
                model: 'GT',
            },

            {
                model: 'Escape'
            }

    ]


}, 

{

        make: 'Fiat',
        vehicles: [
            {
                model: '500',
            },

            {
                model: '500C',
            },

            {
                model: '500L',
            },

            {
                model: '500X',
            },

            {
                model: 'Panda',
            },

            {
                model: 'Tipo',
            },

            {
                model: 'Qubo',
            },

            {
                model: 'Doblo',
            }

        ]

},

{
    
        make: 'Honda', 
        vehicles: [
            {
                model: 'Civic',
            }, 
    
            {
                model: 'Accord',
            },
    
            {
                model: 'Pilot',
            },

            {
                model: 'Corolla'
            },

            {
                model: 'Camry'
            }

        ]


},

{

        make: 'Volkswagen',
        vehicles: [
            {
                model: 'Golf',
            },

            {
                model: 'Jetta',
            },

            {
                model: 'Beetle',
            }

            ]
        },

{
        make: 'Volvo',
        vehicles: [
            {
                model: 'V60',
            },

            {
                model: 'V60 Cross Country',
            },

            {
                model: 'V90 Cross Country'
            },

            {
                model: 'XC60',
            },

            {
                model: 'XC90'
            },

            {
                model: 'S60',
            },

            {
                model: 'S90',
            },

            {
                model: 'XC90 Hybrid',
            },




        ]

},

{

        make: 'Kia',
        vehicles: [
            {
                model: 'Picanto'
            },

            {
                model: 'Rio'
            },

            {
                model: 'Venga'
            },

            {
                model: 'Pro ceed'
            },

            {
                model: 'Cee`d'
            },

            {
                model: 'Stonic'
            },

            {
                model: 'Soul'
            },

            {
                model: 'Niro'
            },

            {
                model: 'Optima'
            },

            {
                model: 'Carens'
            },

            {
                model: 'Sportage'
            }

        ]


        },

{
        make: 'Mercedes Benz',
        vehicles: [
            {
                model: 'A-Class'
            },

            {
                model: 'B-Class'
            },

            {
                model: 'GLA-Class'
            },

            {
                model: 'CLA'
            },

            {
                model: 'V-Class'
            }
        ]


        },

{
        make: 'Peugeot',
        vehicles: [
            {
                model: '108',
            },

            {
                model: '208',
            },

            {
                model: '308',
            },

            {
                model: '308 SW',
            },

            {
                model: '2008 SUV'
            },

            {
                model: '3008 SUV',
            },

            {
                model: '5008 SUV',
            },

            {
                model: 'Partner',
            }

        ]


        },

{
        make: 'Vauxhall',
        vehicles: [
            {
                model: 'Vivaro'
            },

            {
                model: 'Viva'
            },

            {
                model: 'Corsa'
            },

            {
                model: 'Mokka X'
            },

            {
                model: 'Astra'
            },

            {
                model: 'GTC'
            },

            {
                model: 'Crossland X'
            },

            {
                model: 'Insignia Grand Sport'
            },

            {
                model: 'Grandland X'
            }
        ]
        },

{
        make: 'Nissan',
        vehicles: [
            {
                model: 'Micra',   
            },

            {
                model: 'Juke',
            },

            {
                model: 'Pulsar',
            },

            {
                model: 'Qashqai',
            },

            {
                model: 'NV200',
            },

            {
                model: 'X-Trail',
            }


        ]

}
    
    
];

function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


function getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
        return[];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return vehicles 
    .map(section => {
        return { 
            make: section.make, 
            vehicles: section.vehicles.filter(vehicle => regex.test(vehicle.model))
        };
    })
    .filter(section => section.vehicles.length > 0);        
}


function getSuggestionValue(suggestion) {
    return suggestion.model;
}

function renderSuggestion(suggestion) {
    return (

        <span>{suggestion.model}</span>

    );
}

function renderSectionTitle(section) {
    return (

        <strong>{section.make}</strong>

    );
}

function getSectionSuggestions(section) {
    return section.vehicles;
}




class AutoMany extends React.Component {
    constructor() {
        super();

        this.state = {
            value: '',
            suggestions: []
        };
    }

    onChange = (event, {newValue, method }) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

render() {
    const { value, suggestions } = this.state;
    const inputProps = {
        placeholder: "Vehicle Model",
        value,
        onChange: this.onChange
    };

return (


<div> 

<Autosuggest
    multiSection={true}
    suggestions={suggestions}
    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
    getSuggestionValue={getSuggestionValue}
    renderSuggestion={renderSuggestion}
    renderSectionTitle={renderSectionTitle}
    getSectionSuggestions={getSectionSuggestions}
    inputProps={inputProps} />

</div>



);
}
}

export default AutoMany;