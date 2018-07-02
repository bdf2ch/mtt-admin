import { Component, OnInit } from '@angular/core';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {

  single: any[] = [
    {
      name: 'Germany',
      value: 40
    },
    {
      name: 'USA',
      value: 49
    },
    {
      name: 'France',
      value: 36
    },
    {
      name: 'United Kingdom',
      value: 36
    },
    {
      name: 'Spain',
      value: 33
    },
    {
      name: 'Italy',
      value: 35
    }
  ];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  tooltipDisabled = false;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'GDP Per Capita';
  showGridLines = true;
  innerPadding = 0;
  barPadding = 8;
  groupPadding = 16;
  roundDomains = false;
  maxRadius = 10;
  minRadius = 3;

  colorScheme = {
    domain: [
      '#0099cc', '#2ECC71', '#4cc3d9', '#ffc65d', '#d96557', '#ba68c8'
    ]
  };
  schemeType = 'ordinal';

  // pie
  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  arcWidth = 0.25;

  constructor() {
  }

  select(data) {
    console.log('Item clicked', data);
  }

  onLegendLabelClick(entry) {
    console.log('Legend clicked', entry);
  }

}
