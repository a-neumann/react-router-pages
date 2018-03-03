export default (component: any) => {

    return !!(component && component.prototype && component.prototype.render);
};
