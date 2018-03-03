import * as React from "react";

import { IPageComponentProps } from "../interfaces/IPageComponent";
import ChildRoutes from "./ChildRoutes";

export default class Page<TData = any, TParams = any>
    extends React.Component<IPageComponentProps<TData, TParams>> {

    public get data() {
        return this.props.route.data || null;
    }

    public renderChildPages() {
        return <ChildRoutes routes={this.props.route.routes} />;
    }
}
