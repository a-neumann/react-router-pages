import * as React from "react";

import * as PropTypes from "prop-types";
import { Route, RouteComponentProps, Switch } from "react-router";

import IPageComponent from "../interfaces/IPageComponent";
import IRouteConfig from "../interfaces/IRouteConfig";
import isReactComponent from "../utils/isReactComponent";

export interface IChildRoutesProps {
    routes?: Array<IRouteConfig>;
}

export default class ChildRoutes extends React.Component<IChildRoutesProps> {

    public static contextTypes = {
        isNavigating: PropTypes.bool
    };

    public render() {

        const isNavigating = !!this.context.isNavigating;

        return this.props.routes ? (
            <Switch>
                {this.props.routes.map((route, index) => (
                    <Route
                        key={route.id || index}
                        path={route.path}
                        exact={route.exact}
                        strict={route.strict}
                        render={this.childRouteRenderer(route, isNavigating)}
                    />
                ))}
            </Switch>
        ) : null;
    }

    private childRouteRenderer(route: IRouteConfig, isNavigating: boolean) {

        if (!isReactComponent(route.component)) {
            return null;
        }

        const routeComponent = route.component as IPageComponent;

        return (props: RouteComponentProps<any>) => React.createElement(routeComponent, {
            ...props,
            route,
            isNavigating
        });
    }
}
