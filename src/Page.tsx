import * as React from "react";
import { renderRoutes } from "react-router-config";
import * as PropTypes from "prop-types";
import { match } from "react-router";
import IRouteConfig from "./IRouteConfig";
import IPageData from "./IPageData";


interface IPageProps<TParams> {
    route: IRouteConfig;
    match: match<TParams>;
}

export default abstract class Page<TParams = null, TData = null>
    extends React.Component<IPageProps<TParams>> {

    static contextTypes = {
        pagesData: PropTypes.any
    };

    get params() {
        return this.props.match.params;
    }

    get data(): TData {

        const pagesData = this.context.pagesData as Array<IPageData>;
        if (pagesData) {

            const pageData = pagesData.find(d => d.id === this.props.route.id);
            if (pageData) {
                return pageData.data;
            }
        }

        return null;
    }

    renderChildPages() {

        const routes = this.props.route.routes;

        return routes ? renderRoutes(routes) : null;
    }
    
    render() {

        return this.renderChildPages();
    }
}
