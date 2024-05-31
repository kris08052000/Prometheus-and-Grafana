import client from "prom-client";

// const activeUserGauge = new client.Gauge({
//     name:"active_users",
//     help:"Total number of users whose request hasnt yet resolved",
//     labelNames:["method", "route"]
// });

// @ts-ignore
// export function requestCountMiddleware (req, res, next) {

//     activeUserGauge.inc({
//         method: req.method,
//         route: req.route ? req.route.path : req.path,
//         });
        
//         res.on('finish', function() {
//             setTimeout(()=>{
//                 activeUserGauge.dec({
//                     method: req.method,
//             route: req.route ? req.route.path : req.path,
//                 })
//             },10000)
//         });

//     next();
// }


export const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000] // Define your own buckets here
});

// @ts-ignore
export function requestCountMiddleware (req, res, next){
    const startTime = Date.now();

    res.on("finish", () => {
        const endTime = Date.now();
        httpRequestDurationMicroseconds.observe({
                    method: req.method,
                    route: req.route ? req.route.path : req.path,
                    code: res.statuscode
                    }, endTime- startTime);
    })
    next();
}