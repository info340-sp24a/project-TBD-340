import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Link } from 'react-router-dom';

export function PCPart(props) {

    const [buildState, setBuildState] = useState([]);

    // If passed an ID which does not exist, `partName` = undefined.
    // SINGULAR PC PART OBJECT
    const {partName} = props;

    useEffect(() => {
        const db = getDatabase();
        const buildRef = ref(db, 'userbuild'); // MAKE SURE TO OVERRIDE IN "userbuild!" ONLY ONE USERBUILD!

        onValue(buildRef, (snapshot) => {
            const buildRefObject = snapshot.val();

            const keyArray = Object.keys(buildRefObject);
            const userComponents = keyArray.map((keyString) => { // Get the parts out of the build in "userbuild"
                const PCObj = buildRefObject[keyString];
                console.log("This is PCObj:", PCObj);
                PCObj.firebaseKey = keyString;
                return PCObj;
            });
            setBuildState(userComponents);
        });

    }, []); // place function to rerun build render here.

    // helper function to make 'Component' look better.
    function capitalizeFirstLetter(string) {
        let returnedString = string.replace(/-/g, ' ');
        return returnedString.charAt(0).toUpperCase() + returnedString.slice(1);
    }

    function createBuildTable() {
        if (buildState.length === 0) {
            return (
                <tr className="item">
                    <th scope="row" className="component">{capitalizeFirstLetter(partName)}</th>
                    <Link to='/search'>
                        <td className="addButton"><button>Add Component</button></td>
                    </Link>
                </tr>
            );
        } else {
            return (
                <tr className="item">
                    <th scope="row" className="component">{capitalizeFirstLetter(partName)}</th>
                    <td className="product">
                        <img src={"/img/icons/" + buildState.Component + ".png"} alt={buildState.Component.replace(/-/g, ' ') + " placeholder"}/>
                    </td>
                    <td className="Title">{buildState.name}</td>
                    <td className="Price">{"$" + buildState.price}</td>
                    <td className="Link">
                        <a href={"https://www.amazon.com/s?k=" + buildState.name} target="_blank" rel="noreferrer">Buy Now</a>
                    </td>
                    <td className="Remove">
                        <button className="fa fa-trash"></button>
                    </td>
                </tr>
            );
        }
    }

    return (
        <tbody>
            {createBuildTable()}
        </tbody>
    )
}