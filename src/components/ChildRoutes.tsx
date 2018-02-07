import * as React from "react";
import * as PropTypes from "prop-types";
import { Route, Switch, RouteComponentProps } from "react-router";
import IRouteConfig from "../interfaces/IRouteConfig";

interface IChildRoutesProps {
    routes: Array<IRouteConfig>;
}

export default class ChildRoutes extends React.Component<IChildRoutesProps> {

    static contextTypes = {
        pagesData: PropTypes.object,
        isNavigating: PropTypes.bool  
    };

    render() {

        const pagesData: Map<string, any> = this.context.pagesData || null;
        const isNavigating = !!this.context.isNavigating;

        return this.props.routes ? (
            <Switch>
                {this.props.routes.map((route, index) => (
                    <Route
                        key={route.id || index}
                        path={route.path}
                        exact={route.exact}
                        strict={route.strict}
                        render={this.childRouteRenderer(route, pagesData, isNavigating)}
                    />
                ))}
            </Switch>
        ) : null;
    }

    private childRouteRenderer(
        route: IRouteConfig,
        pagesData: Map<string, any>,
        isNavigating: boolean
    ) {

        const pageData = route.id ? pagesData.get(route.id) : null;
    
        return (props: RouteComponentProps<any>) => (
            <route.component
                {...props}
                data={pageData}
                params={props.match.params}
                route={route}
                isNavigating={isNavigating}
            />
        );
    }
}