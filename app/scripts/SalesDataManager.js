'use strict';

export class SalesDataManager {
    constructor() {
        this.data = [];
    }

    async loadData(url) {
        try {
            this.data = await d3.csv(url, d => ({
                location: d.location || 'Unknown',
                client: d.client || 'Unknown',
                salesrep: d.salesrep || 'Unknown',
                paid: d.paid.toLowerCase() === 'yes',
                reimbursed: d.reimbursed.toLowerCase() === 'yes',
                sales: parseFloat(d.sales) || 0,
                expenses: parseFloat(d.expenses) || 0,
                profits: (parseFloat(d.sales) || 0) - (parseFloat(d.expenses) || 0)
            }));

            console.log('✅ Data loaded:', this.data.length, 'records');
            return this;
        } catch (error) {
            console.error('❌ Error loading data:', error);
        }
    }

    getAllData() {
        return this.data;
    }
}
