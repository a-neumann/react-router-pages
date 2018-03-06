import * as React from "react";

import * as PropTypes from "prop-types";
import { Route, RouteComponentProps, withRouter } from "react-router";

import IRouteConfig from "../interfaces/IRouteConfig";
import IRoutesData from "../interfaces/IRoutesData";
import { IRoutesLoader } from "../services/RoutesLoader";
import ChildRoutes from "./ChildRoutes";

export type RouterLocation = RouteComponentProps<any>["location"];

export interface IPageRouterProps extends RouteComponentProps<any> {
    routesLoader: IRoutesLoader;
    onLocationChange?: (next: string, previous?: string) => void;
    onLocationChangeDone?: (next: string) => void;
}

export interface IPageRouterState {
    previousLocation: RouterLocation | null;
}

export class InternalPageRouter extends React.Component<IPageRouterProps, IPageRouterState> {

    public static childContextTypes = {
        isNavigating: PropTypes.bool
    };

    public state = {
        previousLocation: null
    };

    public getChildContext() {

        return {
            isNavigating: !!this.state.previousLocation
        };
    }

    public componentWillReceiveProps(nextProps: IPageRouterProps) {

        const navigated = nextProps.location !== this.props.location;
        if (navigated) {
            this.handleLocationChange(this.props.location, nextProps.location);
        }
    }

    public componentDidUpdate(prevProps: IPageRouterProps, prevState: IPageRouterState) {

        const hasNavigated =
            this.state.previousLocation === null &&
            prevState.previousLocation !== null;

        const { onLocationChangeDone, location } = this.props;

        if (hasNavigated && onLocationChangeDone && location) {

            onLocationChangeDone(location.pathname);
        }
    }

    public render() {

        const { location, routesLoader } = this.props;
        const { previousLocation } = this.state;

        return (
            <Route
                location={previousLocation || location}
                render={() => <ChildRoutes routes={routesLoader.routes} />}
            />
        );
    }

    private async handleLocationChange(previousLocation: RouterLocation, nextLocation: RouterLocation) {

        if (nextLocation) {
            if (this.props.onLocationChange) {
                this.props.onLocationChange(nextLocation.pathname, previousLocation!.pathname);
            }

            // save the location so we can render the old screen
            await new Promise((resolve, reject) => {
                this.setState({ previousLocation }, resolve);
            });

            await this.props.routesLoader.prepareMatchingRoutes(nextLocation.pathname);

            // clear previousLocation so the next screen renders
            this.setState({ previousLocation: null });
        }
    }
}

export default withRouter(InternalPageRouter);
