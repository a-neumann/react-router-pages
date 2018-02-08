import * as React from "react";
import * as PropTypes from "prop-types";
import { Route, RouteProps, withRouter } from "react-router";
import IRouteConfig from "../interfaces/IRouteConfig";
import IRoutesData from "../interfaces/IRoutesData";
import RoutesLoader from "../services/RoutesLoader";
import ChildRoutes from "./ChildRoutes";

type RouterLocation = RouteProps["location"];

interface IPageRouterServerRenderInfo {
    location: string;
    context: any;
}

interface IPageRouterProps {
    routes: Array<IRouteConfig>;
    initialData?: IRoutesData;
}

interface IPageRouterState {
    previousLocation: RouterLocation;
}

class PageRouter extends React.Component<IPageRouterProps & RouteProps, IPageRouterState> {

    static childContextTypes = {
        isNavigating: PropTypes.bool
    }

    private routesLoader: RoutesLoader;

    constructor(props: IPageRouterProps & RouteProps, context: any) {
        super(props, context);

        this.routesLoader = new RoutesLoader(props.routes);

        if (props.initialData) {
            this.routesLoader.addDataToRoutes(props.initialData);
        }

        this.state = {
            previousLocation: null
        };
    }

    getChildContext() {

        return {
            isNavigating: !!this.state.previousLocation
        };
    }

    componentWillReceiveProps(nextProps: IPageRouterProps & RouteProps) {

        const navigated = nextProps.location !== this.props.location;
        if (navigated) {
            this.handleLocationChange(this.props.location, nextProps.location);
        }
    }

    render() {

        const { location, routes } = this.props;
        const { previousLocation } = this.state;

        return (
            <Route
                location={previousLocation || location}
                render={() => <ChildRoutes routes={routes} />}
            />
        )
    }

    private async handleLocationChange(previousLocation: RouterLocation, nextLocation: RouterLocation) {

        // save the location so we can render the old screen
        await new Promise((resolve, reject) => {
            this.setState({ previousLocation }, resolve);
        });
        
        await this.routesLoader.prepareMatchingRoutes(nextLocation.pathname);

        // clear previousLocation so the next screen renders
        this.setState({ previousLocation: null });
    }
}

export default withRouter(PageRouter as any) as typeof PageRouter;