import React, { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Divider } from '@mui/material';
import { useNavigate } from "react-router-dom";

/**
 * @class ListTemplateItem
 * @description This class is used to create the items that will be displayed in the list
 * @param {string} tag - The tag that wil be displayed in the list
 * @param {React.ComponentType} icon - The icon that will be displayed in the list
 * @param {string} redirection - The redirection that the tag will follow, must be blank if the tag contains subElements
 * @param {ListTemplateItem[]} subElements - The subElements that will be displayed when the tag is clicked
 */


export class ListTemplateItem {
    constructor({tag, icon, redirection, subElemnets}) {
        this.tag = tag;
        this.icon = icon;
        if (redirection) this.redirection = redirection;
        this.subElements = subElemnets;
    }

    /**
     * @function getSubElements
     * @description This function returns the subElements of the ListTemplateItem
     * @returns {ListTemplateItem[]}
     */
    getSubElements() {
        return this.subElements;
    }

    /**
     * @function getIcon
     * @description This function returns the icon of the ListTemplateItem
     * @returns {import("react").ReactComponentElement}
     */
    getIcon() {
        return this.icon;
    }

    /**
     * @function getTag
     * @description This function returns the tag of the ListTemplateItem
     * @returns {string}
     */

    getTag() {
        return this.tag;
    }

    /**
     * @function getRedirection
     * @description This function returns the redirection of the ListTemplateItem
     * @returns {string}
     */
    getRedirection() {
        return this.redirection;
    }

    /**
     * @function hasSubElements
     * @description This function returns if the ListTemplateItem has subElements
     * @returns {boolean}
     */

    hasSubElements() {
        return this.subElements? true : false;
    }

    /**
     * @function setSubElements
     * @description This function sets the subElements of the ListTemplateItem
     * @param {ListTemplateItem[]} subElements
     */

    setSubElements(subElements) {
        this.subElements = subElements;
    }

    /**
     * @function setIcon
     * @description This function sets the icon of the ListTemplateItem
     * @param {import("react").ReactComponentElement} icon
     */
    setIcon(icon) {
        this.icon = icon;
    }

    /**
     * @function setTag
     * @description This function sets the tag of the ListTemplateItem
     * @param {string} tag
     */
    setTag(tag) {
        this.tag = tag;
    }

    /**
     * @function setRedirection
     * @description This function sets the redirection of the ListTemplateItem
     * @param {string} redirection
     */

    setRedirection(redirection) {
        this.redirection = redirection;
    }

    /**
     * @function addSubElement
     * @description This function adds a subElement to the ListTemplateItem
     * @param {ListTemplateItem} subElement
     * @returns {boolean}
     * @throws {Error} If the subElement is not a ListTemplateItem
     * @throws {Error} If the subElement is already in the subElements
     * @throws {Error} If the subElement is the ListTemplateItem itself
     * @throws {Error} If the subElement is null
     * @throws {Error} If the subElement is undefined
     * @throws {Error} If the subElement is not an object
     * 
     */

    addSubElement(subElement) {
        if (subElement === null || subElement === undefined) throw new Error("The subElement cannot be null or undefined");
        if (typeof subElement !== "object") throw new Error("The subElement must be an object");
        if (subElement === this) throw new Error("The subElement cannot be the ListTemplateItem itself");
        if (this.subElements.includes(subElement)) throw new Error("The subElement is already in the subElements");
        if (!(subElement instanceof ListTemplateItem)) throw new Error("The subElement must be a ListTemplateItem");
        this.subElements.push(subElement);
        return true;
    }

    /**
     * @function removeSubElement
     * @description This function removes a subElement from the ListTemplateItem
     * @param {ListTemplateItem} subElement
     * @returns {boolean}
     * @throws {Error} If the subElement is not a ListTemplateItem
     * @throws {Error} If the subElement is not in the subElements
     * @throws {Error} If the subElement is the ListTemplateItem itself
     * @throws {Error} If the subElement is null
     * @throws {Error} If the subElement is undefined
     * @throws {Error} If the subElement is not an object
     */

    removeSubElement(subElement) {
        if (subElement === null || subElement === undefined) throw new Error("The subElement cannot be null or undefined");
        if (typeof subElement !== "object") throw new Error("The subElement must be an object");
        if (subElement === this) throw new Error("The subElement cannot be the ListTemplateItem itself");
        if (!this.subElements.includes(subElement)) throw new Error("The subElement is not in the subElements");
        if (!(subElement instanceof ListTemplateItem)) throw new Error("The subElement must be a ListTemplateItem");
        this.subElements = this.subElements.filter(sub => sub !== subElement);
        return true;
    }

}


const SimpleItemTemplate = ({ tag, icon, redirection }) => {
    const navigate = useNavigate();

    return (
        <>
            <ListItem disableGutters disablePadding sx={{ display: 'block' }}>
                <ListItemButton 
                     sx={{
                        minHeight: 48,
                        justifyContent: 'initial',
                        px: 2.5,
                      }}
                    onClick={() => navigate(redirection)}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={tag} />
                </ListItemButton>
            </ListItem>
            <Divider/>
        </>
    )
}

const NestedItemTemplate = ({ tag, icon, subElements }) => {
    const [open, setOpen] = useState(false);

    return (
        <>  
            <ListItem disableGutters disablePadding sx={{ display: 'block' }} >
                <ListItemButton 
                    onClick={() => setOpen(!open)}
                    sx={{
                        minHeight: 48,
                        justifyContent: 'initial',
                        px: 2.5,
                      }}
                    >
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={tag} />
                </ListItemButton>
            </ListItem>
            <Divider />
            <Collapse in={open} timeout="auto" unmountOnExit sx={{pl: "16px"}}>
                {
                    subElements.map((subElement, index) => (
                        <>
                            <SimpleItemTemplate key={`${tag}${index}`} tag={subElement.tag} icon={subElement.icon} redirection={subElement.redirection} />
                            <Divider />
                        </>
                    ))
                }
            </Collapse>
        </>
    )
}


/**
 * Component to display a list of items in a sidebar
 * @param {ListTemplateItem[]} items - The items that will be displayed in the list
 * @returns {JSX.Element}
 * @example
 * <ListTemplate items={items} />
 */

export default function ListTemplate({ items }) {
    return(
        <List disablePadding>
            {items.map((item, index) =>
                item.hasSubElements() ?
                    <NestedItemTemplate key={`${item.getTag()}${index}`} tag={item.tag} icon={item.icon} subElements={item.getSubElements()} />
                    :
                    <SimpleItemTemplate key={`${item.getTag()}${index}`} tag={item.tag} icon={item.icon} redirection={item.redirection} />
            )
            }
        </List>
    )
}