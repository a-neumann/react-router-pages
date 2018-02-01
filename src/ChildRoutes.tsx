import * as React from "react";
import * as PropTypes from "prop-types";
import { Route, Switch, RouteComponentProps } from "react-router";
import IRouteConfig from "./IRouteConfig";

interface IChildRoutesProps {
    routes: Array<IRouteConfig>;
}

export default class ChildRoutes extends React.Component<IChildRoutesProps> {

    static contextTypes = {
        pagesData: PropTypes.any
    };

    render() {

        const pagesData: Map<string, any> = this.context.pagesData || null;

        return this.props.routes ? (
            <Switch>
                {this.props.routes.map((route, index) => (
                    <Route
                        key={route.id || index}
                        path={route.path}
                        exact={route.exact}
                        strict={route.strict}
                        render={this.childRouteRenderer(route, pagesData)}
                    />
                ))}
            </Switch>
        ) : null;
    }

    private childRouteRenderer(route: IRouteConfig, pagesData: Map<string, any>) {

        const pageData = route.id ? pagesData.get(route.id) : null;
    
        return (props: RouteComponentProps<any>) => (
            <route.component {...props} data={pageData} params={props.match.params} route={route} />
        );
    }
}