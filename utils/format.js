/**
 * 通过字符串设定时间
 * @param {string} T 格式为 'YYYY-MM-DD hh:mm:ss' 如果没有空格则表示没有日期，即按照当前日期来设定时间
 * @returns {Date} 返回一个日期
 */
export const setTime = T => {
    const res = new Date()
    // 区分日期时间
    const [time, date] = T.split(' ').reverse()
    if (date) {
        // 日期
        const [day, month, year] = date.split('-').reverse().map(n => +n)
        if (year) {
            res.setFullYear(year)
        }
        if (month) {
            res.setMonth(month - 1)
        }
        if (day) {
            res.setDate(day)
        }
    }
    if (time) {
        // 时间
        const [hour, minute, second] = time.split(':').map(n => +n)
        if (hour) {
            res.setHours(hour)
        }
        if (minute) {
            res.setMinutes(minute)
        }
        else {
            res.setMinutes(0)
        }
        if (second) {
            res.setSeconds(second)
        }
        else {
            res.setSeconds(0)
        }
    }
    return res
}

/**
 * 格式化时间
 * @param {Date} time 传入的时间
 * @param {string} type 格式化方式 如'h:m:s'表示时:分:秒 Y:年 M:月 D:日 h:小时 m:分钟 s:秒
 * @returns 格式化后的数组
 */
export const formatTime = (time, type = 'h:m:s') => {
    time = new Date(time)
    var res = ''
    for (var i = 0; i < type.length; i++)
        switch (type[i]) {
            case 'y':
                res += time.getFullYear()
                break
            case 'M':
                res += (time.getMonth() + 1)
                break
            case 'd':
                res += time.getDate()
                break
            case 'h':
                res += time.getHours()
                break
            case 'm':
                var min = time.getMinutes()
                if (min < 10) {
                    res += '0'
                }
                res += time.getMinutes()
                break
            case 's':
                var s = time.getSeconds()
                if (s < 10) {
                    res += '0'
                }
                res += time.getSeconds()
                break
            default:
                res += type[i]
        }
    return res
}
/**
 * 格式化时间，以中文显示
 * @param {Date} time 传入的时间
 * @param {string} type 格式化方式 如‘时分’表示xx时xx分
 * @returns 格式化后的字符串
 */
export const formatTimeCN = (time, type = '分秒') => {
    time = new Date(time)
    var res = ''
    for (var i = 0; i < type.length; i++)
        switch (type[i]) {
            case '年':
                res += time.getFullYear() + '年'
                break
            case '月':
                res += (time.getMonth() + 1) + '月'
                break
            case '日':
                res += time.getDate() + '日'
                break
            case '时':
                res += time.getHours() + '时'
                break
            case '分':
                res += time.getMinutes() + '分'
                break
            case '秒':
                res += time.getSeconds() + '秒'
                break
        }
    return res
}
/**
 * 计算时间差，跟当前时间比较
 * @param {*} time 传入的时间
 * @param {*} type 格式化方式 如‘时分’表示xx时xx分
 * @returns 格式化后的字符串
 */
export const calculateTime = (time, type = '分秒') => {
    return formatTimeCN(new Date(time) - new Date(), type)
}