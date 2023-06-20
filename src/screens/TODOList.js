// 乘客--------------------------------------------------------
//todo 1. 订单列表页  频发读取orders的内容  加载/渲染慢
/*使用了useCallback钩子来定义的函数：openSheet、handleRefresh 和 fetchMoreOrders。
useCallback 是 React 提供的一个 Hook，它会返回一个记忆版本的回调函数，该函数仅在其依赖项发生改变时才会更新。
这些函数在组件重新渲染时不会改变，除非它们的依赖项（例如 loading 和 page）发生变化。这有助于优化性能，因为它避免了不必要的函数创建。

renderItem 函数也被封装在 useCallback 钩子中。
因为 renderItem 函数在组件每次渲染时都会重新创建，这可能会引起不必要的渲染。
使用 useCallback 可以避免这种情况。

从handleRefresh 和 fetchMoreOrders 函数中，将对 setOrders 和 setPage 的调用移到 then 语句的后面。
这意味着状态更新将在异步操作完成后进行，这会减少不必要的重新渲染。*/

//todo 2. 每次进入订单列表 都需要刷新页面  目前是如果之前加载了一次就不刷新了
/*const OrderListScreen = ({navigation}) => {
    // ...

    useFocusEffect(
        React.useCallback(() => {
            handleRefresh();
        }, [])
    );

    // ...
};
每当OrderListScreen获得焦点时，都会触发handleRefresh函数。
也就是说，每当用户导航到这个页面时，都会触发一个数据刷新。
需要注意的是，假设handleRefresh没有依赖项，因此我传入了一个空数组([])作为依赖项列表。
 */

//todo 3. cancel order之后需要刷新当前页  和第二个一样
/*在handleConfirmCancel函数中调用handleRefresh函数.
    当取消订单成功后执行handleRefresh函数*/

//todo 4. 用户评价功能
//做完


//todo 5. 订单详情页中  订单状态图标 更换其他的 目前用的钱包的图标
//Done

// 司机--------------------------------------------------------
//todo 6. 订单广场 改为类似乘客订单列表的 卡片样
//Done

//todo 7. 司机的主页


//todo 8. 司机 订单列表页
//todo 9. 司机 订单详情页
//todo 10. 订单广场  卡片样式   价格  用预期收益字段
//todo 11. 订单广场  卡片  地图 可以点击 跳转本机地图
//todo 12. 订单广场  司机接受订单后刷新当前页面
//todo 13. 订单广场  websocket 更新订单  不能展示订单内容问题





// 后续内容------------------------------------
// 司机接口
// 如果支付相关内容有进展 优先接入支付内容 然后梳理乘客和司机支付相关的内容
// 如果支付无法推进 则对接乘客和司机聊天内容
