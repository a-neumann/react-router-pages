import * as React from "react";
import * as PropTypes from "prop-types";
import { renderRoutes } from "react-router-config";
import { Route, RouteProps, withRouter } from "react-router";
import IRouteConfig from "./IRouteConfig";
import IPageData from "./IPageData";
import IPagesDataLoader from "./InitialRouteDataLoader";

type RouterLocation = RouteProps["location"];

interface IPageRouterServerRenderInfo {
    location: string;
    context: any;
}

interface IPageRouterProps {
    routes: Array<IRouteConfig>;
    initialData?: Array<IPageData>;
    serverRenderInfo?: IPageRouterServerRenderInfo;
}

interface IPageRouterState {
    previousLocation: RouterLocation;
    pagesData: Array<IPageData>;
}

class PageRouter extends React.Component<IPageRouterProps & RouteProps, IPageRouterState> {

    static childContextTypes = {
        pagesData: PropTypes.any
    }

    private pagesDataLoader: IPagesDataLoader;

    constructor(props: IPageRouterProps & RouteProps, context: any) {
        super(props, context);

        this.pagesDataLoader = new IPagesDataLoader(props.routes);

        this.state = {
            previousLocation: null,
            pagesData: props.initialData
        };
    }

    getChildContext() {

        return {
            pagesData: this.state.pagesData
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
                render={() => renderRoutes(routes)}
            />
        )
    }

    private async handleLocationChange(previousLocation: RouterLocation, nextLocation: RouterLocation) {

        // save the location so we can render the old screen
        await new Promise((resolve, reject) => {
            this.setState({ previousLocation }, resolve);
        });
        
        const pagesData = await this.pagesDataLoader.loadData(nextLocation.pathname);

        // clear previousLocation so the next screen renders
        this.setState({
            previousLocation: null,
            pagesData
        });
    }
}

export default withRouter(PageRouter as any) as typeof PageRouter;