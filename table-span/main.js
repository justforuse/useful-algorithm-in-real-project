function calculateRowSpan(arr, group) {
    let res = [];
    if (!group) {
        const t = [];
        arr.forEach((item, index) => {
            if (index > 0 && item === arr[index - 1]) {
                t[t.length - 1]++;
            } else {
                t.push(1);
            }
        });
        res = t.map((i) => {
                if (i > 1) {
                    return [i].concat(new Array(i - 1).fill(0));
                }
                return i;
            })
            .flat();
    } else {
        /**
         * 分组信息
         * @example
            const array = [1, 1, 1, 2, 2, 3];
            const splitter = [2, 0, 2, 0, 2, 0];
            
            output: res = [2, 0, 1, 1, 1, 1]
         */
        const sliceInfo = group
                            .filter(i => i !== 0) // 2,2,2
                            .reduce((prev, cur, index) => {
                                const start = index > 0 ? prev[index - 1][1] : 0;
                                prev.push([start, cur + start]);
                                return prev;
                            }, [])
        const t = [];
        sliceInfo.forEach(info => {
            t.push(calculateRowSpan(arr.slice(...info)))
        })
        res = t.flat();
    }
    return res;
}


new Vue({
    el: '#app',
    data() {
        return {
            tableData: [
                {
                    date: '05-01',
                    department: 'Department I',
                    income: 5000
                },
                {
                    date: '05-01',
                    department: 'Department I',
                    income: 1000
                },
                {
                    date: '05-01',
                    department: 'Department II',
                    income: 7000
                },
                {
                    date: '05-01',
                    department: 'Department III',
                    income: 3000
                },
                {
                    date: '05-02',
                    department: 'Department III',
                    income: 8000
                },
                {
                    date: '05-02',
                    department: 'Department IV',
                    income: 2000
                },
            ],
            fields: [ 'date', 'department', 'income'],
            concat: true
        }
    },
    computed: {
        spanInfo() {
            let res = {};
            let lastRes;
            this.fields.forEach((f, index) => {
                const t = index === this.fields.length - 1 ? new Array(this.tableData.length).fill(1) : calculateRowSpan(this.tableData.map(row => row[f]), lastRes);
                lastRes = t;
                res[f] = t
            })
            return res;
        },
        arraySpanMethod() {
            if (this.concat) {
                return ({ columnIndex, rowIndex }) => {
                    const fieldId = this.fields[columnIndex];
                    if (this.spanInfo[fieldId]) {
                        const res = this.spanInfo[fieldId]?.[rowIndex];
                        return [res, 1];
                    }
                }
            }
            return;
        }
    },
    methods: {
        handleToggle() {
            this.concat = !this.concat;
        }
    }
})