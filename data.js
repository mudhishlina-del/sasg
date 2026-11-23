globalThis.SASG_DATA = {
  "harmonics": [
    {
      "Harmonic": 1.0,
      "Period_h": 24.0,
      "a_k_MW": -819.899224935371,
      "b_k_MW": -567.045188802089,
      "Amplitude_MW": 996.882633610005,
      "Phase_rad": 2.5365241683514,
      "Phase_deg": 145.332129479466
    },
    {
      "Harmonic": 2.0,
      "Period_h": 12.0,
      "a_k_MW": 254.970978833334,
      "b_k_MW": 166.420111801876,
      "Amplitude_MW": 304.476359770964,
      "Phase_rad": -0.57827246971501,
      "Phase_deg": -33.1325719232768
    },
    {
      "Harmonic": 3.0,
      "Period_h": 8.0,
      "a_k_MW": -50.9431763877416,
      "b_k_MW": 54.3137157202483,
      "Amplitude_MW": 74.4660119505033,
      "Phase_rad": -2.32418339893463,
      "Phase_deg": -133.165899573325
    },
    {
      "Harmonic": 4.0,
      "Period_h": 6.0,
      "a_k_MW": -85.4625000000037,
      "b_k_MW": 104.262241737284,
      "Amplitude_MW": 134.812662455477,
      "Phase_rad": -2.25742734155423,
      "Phase_deg": -129.341059228494
    },
    {
      "Harmonic": 5.0,
      "Period_h": 4.8,
      "a_k_MW": 10.232642531367,
      "b_k_MW": -56.8392212339234,
      "Amplitude_MW": 57.7529570122053,
      "Phase_rad": 1.39267641719908,
      "Phase_deg": 79.794480932908
    },
    {
      "Harmonic": 6.0,
      "Period_h": 4.0,
      "a_k_MW": 64.7416666666524,
      "b_k_MW": -23.9166666666627,
      "Amplitude_MW": 69.0180436351262,
      "Phase_rad": 0.353866947670641,
      "Phase_deg": 20.2750826107045
    },
    {
      "Harmonic": 7.0,
      "Period_h": 3.42857142857143,
      "a_k_MW": -40.5485703499697,
      "b_k_MW": -84.0635711021635,
      "Amplitude_MW": 93.3320445713847,
      "Phase_rad": 2.02022938935499,
      "Phase_deg": 115.750617658332
    }
  ],
  "orders": [
    {
      "Harmonics_K": 1.0,
      "Fit_RMSE_MW": 274.835280006102,
      "Variation_Explained_pct": 86.8044133174549,
      "Predicted_Peak_Hour": 14.0
    },
    {
      "Harmonics_K": 3.0,
      "Fit_RMSE_MW": 162.508186988954,
      "Variation_Explained_pct": 95.3864606257164,
      "Predicted_Peak_Hour": 13.0
    },
    {
      "Harmonics_K": 5.0,
      "Fit_RMSE_MW": 125.115873642969,
      "Variation_Explained_pct": 97.2653070771002,
      "Predicted_Peak_Hour": 14.0
    },
    {
      "Harmonics_K": 7.0,
      "Fit_RMSE_MW": 94.4288165333805,
      "Variation_Explained_pct": 98.4422676661735,
      "Predicted_Peak_Hour": 13.0
    }
  ],
  "kpis": [
    {
      "Method": "No Control",
      "Peak_MW": 14110.9,
      "Peak_Reduction_pct": 0.0,
      "Daily_Energy_MWh": 303492.7,
      "Shifted_Energy_MWh": 0.0,
      "Load_Factor": 0.896153269222138,
      "Max_Ramp_MW_per_h": 536.300000000001,
      "Hypothetical_Cost_Exposure_Index": 344524.45,
      "Cost_Exposure_Change_pct": 0.0
    },
    {
      "Method": "Fourier Only - No DR",
      "Peak_MW": 14110.9,
      "Peak_Reduction_pct": 0.0,
      "Daily_Energy_MWh": 303492.7,
      "Shifted_Energy_MWh": 0.0,
      "Load_Factor": 0.896153269222138,
      "Max_Ramp_MW_per_h": 536.300000000001,
      "Hypothetical_Cost_Exposure_Index": 344524.45,
      "Cost_Exposure_Change_pct": 0.0
    },
    {
      "Method": "Fixed Time - DR",
      "Peak_MW": 13756.8251833333,
      "Peak_Reduction_pct": 2.50922915382199,
      "Daily_Energy_MWh": 303492.7,
      "Shifted_Energy_MWh": 2124.4489,
      "Load_Factor": 0.919218569556803,
      "Max_Ramp_MW_per_h": 536.300000000001,
      "Hypothetical_Cost_Exposure_Index": 343462.22555,
      "Cost_Exposure_Change_pct": 0.308316129668005
    },
    {
      "Method": "Peak Shaving Only - Direct",
      "Peak_MW": 13646.844,
      "Peak_Reduction_pct": 3.28863502682324,
      "Daily_Energy_MWh": 303492.7,
      "Shifted_Energy_MWh": 2124.4489,
      "Load_Factor": 0.926626637387126,
      "Max_Ramp_MW_per_h": 489.199999999999,
      "Hypothetical_Cost_Exposure_Index": 343466.489033333,
      "Cost_Exposure_Change_pct": 0.307078631622974
    },
    {
      "Method": "Proposed - Fourier + DR",
      "Peak_MW": 13646.844,
      "Peak_Reduction_pct": 3.28863502682324,
      "Daily_Energy_MWh": 303492.7,
      "Shifted_Energy_MWh": 2124.4489,
      "Load_Factor": 0.926626637387126,
      "Max_Ramp_MW_per_h": 686.017921415289,
      "Hypothetical_Cost_Exposure_Index": 343507.334083461,
      "Cost_Exposure_Change_pct": 0.295223144987083
    }
  ],
  "profiles": [
    {
      "Hour": 0.0,
      "Original_Load_MW": 11742.1,
      "Fourier_K5_MW": 11954.4278867083,
      "Fixed_Time_MW": 12096.1748166667,
      "Direct_DR_MW": 12131.784225,
      "Proposed_Fourier_DR_MW": 12015.7187606751
    },
    {
      "Hour": 1.0,
      "Original_Load_MW": 12082.3,
      "Fourier_K5_MW": 12008.518399101,
      "Fixed_Time_MW": 12436.3748166667,
      "Direct_DR_MW": 12082.3,
      "Proposed_Fourier_DR_MW": 12082.3
    },
    {
      "Hour": 2.0,
      "Original_Load_MW": 12005.6,
      "Fourier_K5_MW": 12073.6199255894,
      "Fixed_Time_MW": 12359.6748166667,
      "Direct_DR_MW": 12005.6,
      "Proposed_Fourier_DR_MW": 12005.6
    },
    {
      "Hour": 3.0,
      "Original_Load_MW": 12105.7,
      "Fourier_K5_MW": 12024.0776684106,
      "Fixed_Time_MW": 12459.7748166667,
      "Direct_DR_MW": 12105.7,
      "Proposed_Fourier_DR_MW": 12105.7
    },
    {
      "Hour": 4.0,
      "Original_Load_MW": 11766.2,
      "Fourier_K5_MW": 11818.8637778804,
      "Fixed_Time_MW": 12120.2748166667,
      "Direct_DR_MW": 12131.784225,
      "Proposed_Fourier_DR_MW": 12175.3828695031
    },
    {
      "Hour": 5.0,
      "Original_Load_MW": 11645.3,
      "Fourier_K5_MW": 11607.763320165,
      "Fixed_Time_MW": 11999.3748166667,
      "Direct_DR_MW": 12109.356,
      "Proposed_Fourier_DR_MW": 12109.356
    },
    {
      "Hour": 6.0,
      "Original_Load_MW": 11601.4,
      "Fourier_K5_MW": 11626.8975620771,
      "Fixed_Time_MW": 11601.4,
      "Direct_DR_MW": 12065.456,
      "Proposed_Fourier_DR_MW": 12065.456
    },
    {
      "Hour": 7.0,
      "Original_Load_MW": 11930.4,
      "Fourier_K5_MW": 11954.5292989769,
      "Fixed_Time_MW": 11930.4,
      "Direct_DR_MW": 12131.784225,
      "Proposed_Fourier_DR_MW": 12203.9173484065
    },
    {
      "Hour": 8.0,
      "Original_Load_MW": 12458.2,
      "Fourier_K5_MW": 12418.9834184667,
      "Fixed_Time_MW": 12458.2,
      "Direct_DR_MW": 12458.2,
      "Proposed_Fourier_DR_MW": 12458.2
    },
    {
      "Hour": 9.0,
      "Original_Load_MW": 12819.8,
      "Fourier_K5_MW": 12793.1766593786,
      "Fixed_Time_MW": 12819.8,
      "Direct_DR_MW": 12819.8,
      "Proposed_Fourier_DR_MW": 12819.8
    },
    {
      "Hour": 10.0,
      "Original_Load_MW": 12990.3,
      "Fourier_K5_MW": 13042.6149079817,
      "Fixed_Time_MW": 12990.3,
      "Direct_DR_MW": 12990.3,
      "Proposed_Fourier_DR_MW": 12990.3
    },
    {
      "Hour": 11.0,
      "Original_Load_MW": 13290.9,
      "Fourier_K5_MW": 13312.1821853582,
      "Fixed_Time_MW": 13290.9,
      "Direct_DR_MW": 13282.3730333333,
      "Proposed_Fourier_DR_MW": 13200.682933079
    },
    {
      "Hour": 12.0,
      "Original_Load_MW": 13699.8,
      "Fourier_K5_MW": 13675.6474042917,
      "Fixed_Time_MW": 13345.7251833333,
      "Direct_DR_MW": 13282.3730333333,
      "Proposed_Fourier_DR_MW": 13246.1177141455
    },
    {
      "Hour": 13.0,
      "Original_Load_MW": 14110.9,
      "Fourier_K5_MW": 13985.7077358291,
      "Fixed_Time_MW": 13756.8251833333,
      "Direct_DR_MW": 13646.844,
      "Proposed_Fourier_DR_MW": 13646.844
    },
    {
      "Hour": 14.0,
      "Original_Load_MW": 13837.4,
      "Fourier_K5_MW": 14026.7074756194,
      "Fixed_Time_MW": 13483.3251833333,
      "Direct_DR_MW": 13373.344,
      "Proposed_Fourier_DR_MW": 13373.344
    },
    {
      "Hour": 15.0,
      "Original_Load_MW": 13774.3,
      "Fourier_K5_MW": 13770.7458885264,
      "Fixed_Time_MW": 13420.2251833333,
      "Direct_DR_MW": 13310.244,
      "Proposed_Fourier_DR_MW": 13310.244
    },
    {
      "Hour": 16.0,
      "Original_Load_MW": 13588.7,
      "Fourier_K5_MW": 13410.3466656618,
      "Fixed_Time_MW": 13234.6251833333,
      "Direct_DR_MW": 13282.3730333333,
      "Proposed_Fourier_DR_MW": 13400.3184527755
    },
    {
      "Hour": 17.0,
      "Original_Load_MW": 13052.4,
      "Fourier_K5_MW": 13142.0424351753,
      "Fixed_Time_MW": 12698.3251833333,
      "Direct_DR_MW": 13052.4,
      "Proposed_Fourier_DR_MW": 13052.4
    },
    {
      "Hour": 18.0,
      "Original_Load_MW": 12908.7,
      "Fourier_K5_MW": 12983.2938135896,
      "Fixed_Time_MW": 12908.7,
      "Direct_DR_MW": 12908.7,
      "Proposed_Fourier_DR_MW": 12908.7
    },
    {
      "Hour": 19.0,
      "Original_Load_MW": 12826.5,
      "Fourier_K5_MW": 12823.6112327597,
      "Fixed_Time_MW": 12826.5,
      "Direct_DR_MW": 12826.5,
      "Proposed_Fourier_DR_MW": 12826.5
    },
    {
      "Hour": 20.0,
      "Original_Load_MW": 12757.4,
      "Fourier_K5_MW": 12594.9058469911,
      "Fixed_Time_MW": 12757.4,
      "Direct_DR_MW": 12757.4,
      "Proposed_Fourier_DR_MW": 12757.4
    },
    {
      "Hour": 21.0,
      "Original_Load_MW": 12268.2,
      "Fourier_K5_MW": 12335.966450351,
      "Fixed_Time_MW": 12268.2,
      "Direct_DR_MW": 12268.2,
      "Proposed_Fourier_DR_MW": 12268.2
    },
    {
      "Hour": 22.0,
      "Original_Load_MW": 11892.1,
      "Fourier_K5_MW": 12120.0413151428,
      "Fixed_Time_MW": 11892.1,
      "Direct_DR_MW": 12131.784225,
      "Proposed_Fourier_DR_MW": 11892.1
    },
    {
      "Hour": 23.0,
      "Original_Load_MW": 12338.1,
      "Fourier_K5_MW": 11988.0287259681,
      "Fixed_Time_MW": 12338.1,
      "Direct_DR_MW": 12338.1,
      "Proposed_Fourier_DR_MW": 12578.1179214153
    }
  ],
  "audit": [
    {
      "Noise_pct": 1.0,
      "Method": "Direct",
      "Mean_PeakReduction_pct": 3.28780042386981,
      "StdDev_pp": 0.0110684201536479,
      "FifthPercentile_pct": 3.28863502682324,
      "Wins_vs_Direct_n": 0.0,
      "Ties_vs_Direct_n": 200.0,
      "Losses_vs_Direct_n": 0.0,
      "Mean_Delta_vs_Direct_pp": 0.0
    },
    {
      "Noise_pct": 1.0,
      "Method": "Fourier K3",
      "Mean_PeakReduction_pct": 3.28676133053211,
      "StdDev_pp": 0.0156211988436509,
      "FifthPercentile_pct": 3.28863502682324,
      "Wins_vs_Direct_n": 2.0,
      "Ties_vs_Direct_n": 194.0,
      "Losses_vs_Direct_n": 4.0,
      "Mean_Delta_vs_Direct_pp": -0.00103909333769467
    },
    {
      "Noise_pct": 1.0,
      "Method": "Fourier K5",
      "Mean_PeakReduction_pct": 3.28863502682324,
      "StdDev_pp": 1.78081445453801e-15,
      "FifthPercentile_pct": 3.28863502682324,
      "Wins_vs_Direct_n": 2.0,
      "Ties_vs_Direct_n": 198.0,
      "Losses_vs_Direct_n": 0.0,
      "Mean_Delta_vs_Direct_pp": 0.000834602953434038
    },
    {
      "Noise_pct": 1.0,
      "Method": "Moving Average 3h",
      "Mean_PeakReduction_pct": 3.28784834204469,
      "StdDev_pp": 0.00805426932075144,
      "FifthPercentile_pct": 3.28863502682324,
      "Wins_vs_Direct_n": 2.0,
      "Ties_vs_Direct_n": 197.0,
      "Losses_vs_Direct_n": 1.0,
      "Mean_Delta_vs_Direct_pp": 4.79181748873869e-05
    },
    {
      "Noise_pct": 1.0,
      "Method": "Moving Average 5h",
      "Mean_PeakReduction_pct": 3.28726102066296,
      "StdDev_pp": 0.0115721848780869,
      "FifthPercentile_pct": 3.28863502682324,
      "Wins_vs_Direct_n": 2.0,
      "Ties_vs_Direct_n": 193.0,
      "Losses_vs_Direct_n": 5.0,
      "Mean_Delta_vs_Direct_pp": -0.000539403206850024
    },
    {
      "Noise_pct": 3.0,
      "Method": "Direct",
      "Mean_PeakReduction_pct": 2.84038009828564,
      "StdDev_pp": 0.691533410119788,
      "FifthPercentile_pct": 1.65118668092657,
      "Wins_vs_Direct_n": 0.0,
      "Ties_vs_Direct_n": 200.0,
      "Losses_vs_Direct_n": 0.0,
      "Mean_Delta_vs_Direct_pp": 0.0
    },
    {
      "Noise_pct": 3.0,
      "Method": "Fourier K3",
      "Mean_PeakReduction_pct": 3.18367783199385,
      "StdDev_pp": 0.279109137712691,
      "FifthPercentile_pct": 2.59348794191006,
      "Wins_vs_Direct_n": 91.0,
      "Ties_vs_Direct_n": 87.0,
      "Losses_vs_Direct_n": 22.0,
      "Mean_Delta_vs_Direct_pp": 0.343297733708207
    },
    {
      "Noise_pct": 3.0,
      "Method": "Fourier K5",
      "Mean_PeakReduction_pct": 3.17453380756022,
      "StdDev_pp": 0.313968126667371,
      "FifthPercentile_pct": 2.43220814167756,
      "Wins_vs_Direct_n": 90.0,
      "Ties_vs_Direct_n": 97.0,
      "Losses_vs_Direct_n": 13.0,
      "Mean_Delta_vs_Direct_pp": 0.334153709274578
    },
    {
      "Noise_pct": 3.0,
      "Method": "Moving Average 3h",
      "Mean_PeakReduction_pct": 3.16625279705692,
      "StdDev_pp": 0.315788758312516,
      "FifthPercentile_pct": 2.48361508435357,
      "Wins_vs_Direct_n": 89.0,
      "Ties_vs_Direct_n": 91.0,
      "Losses_vs_Direct_n": 20.0,
      "Mean_Delta_vs_Direct_pp": 0.325872698771278
    },
    {
      "Noise_pct": 3.0,
      "Method": "Moving Average 5h",
      "Mean_PeakReduction_pct": 3.16568687159359,
      "StdDev_pp": 0.243355250872595,
      "FifthPercentile_pct": 2.61099748111908,
      "Wins_vs_Direct_n": 90.0,
      "Ties_vs_Direct_n": 81.0,
      "Losses_vs_Direct_n": 29.0,
      "Mean_Delta_vs_Direct_pp": 0.325306773307948
    }
  ],
  "presets": [
    {
      "Scenario": "Scenario 1 (Cap 13,500 MW)",
      "PeakCap_MW": 13500.0,
      "PeakBefore_MW": 14104.7037452384,
      "PeakAfter_MW": 13500.0,
      "PeakReduction_pct": 4.28724882252498,
      "EnergyShift_MWh": 1521.89772756856,
      "EnergyAfter_MWh": 303437.365571304,
      "EnergyDiff_MWh": 5.82076609134674e-11
    },
    {
      "Scenario": "Scenario 2 (Cap 13,200 MW)",
      "PeakCap_MW": 13200.0,
      "PeakBefore_MW": 14104.7037452384,
      "PeakAfter_MW": 13200.0,
      "PeakReduction_pct": 6.41419884869109,
      "EnergyShift_MWh": 3111.1587401635,
      "EnergyAfter_MWh": 303437.365571304,
      "EnergyDiff_MWh": 5.82076609134674e-11
    },
    {
      "Scenario": "Scenario 3 (Cap 13,000 MW)",
      "PeakCap_MW": 13000.0,
      "PeakBefore_MW": 14104.7037452384,
      "PeakAfter_MW": 13000.0,
      "PeakReduction_pct": 7.83216553280183,
      "EnergyShift_MWh": 4356.07695880014,
      "EnergyAfter_MWh": 303437.365571304,
      "EnergyDiff_MWh": 5.82076609134674e-11
    }
  ],
  "capBaseline": [
    11739.327012075126,
    12056.283688811674,
    11999.988894840033,
    12101.870758796602,
    11764.48204101053,
    11641.293927846218,
    11594.960693221015,
    11933.760643451753,
    12457.882963906128,
    12822.648441403953,
    12994.374903134742,
    13289.261012594932,
    13702.931797268626,
    14104.703745238368,
    13847.204456468357,
    13785.647090754983,
    13581.41063783823,
    13044.918218636647,
    12915.650257926625,
    12832.164552095655,
    12745.489292099923,
    12270.391750317916,
    11880.02581296712,
    12330.692978598947
  ],
  "demandReport": [
    {
      "Method": "Fixed-time DR",
      "Hour": 0.0,
      "Baseline_MW": 11742.1,
      "ControlledLoad_MW": 12096.1748166667,
      "Change_MW": 354.0748166667
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 1.0,
      "Baseline_MW": 12082.3,
      "ControlledLoad_MW": 12436.3748166667,
      "Change_MW": 354.0748166667
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 2.0,
      "Baseline_MW": 12005.6,
      "ControlledLoad_MW": 12359.6748166667,
      "Change_MW": 354.0748166667
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 3.0,
      "Baseline_MW": 12105.7,
      "ControlledLoad_MW": 12459.7748166667,
      "Change_MW": 354.0748166667
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 4.0,
      "Baseline_MW": 11766.2,
      "ControlledLoad_MW": 12120.2748166667,
      "Change_MW": 354.0748166667
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 5.0,
      "Baseline_MW": 11645.3,
      "ControlledLoad_MW": 11999.3748166667,
      "Change_MW": 354.0748166667
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 6.0,
      "Baseline_MW": 11601.4,
      "ControlledLoad_MW": 11601.4,
      "Change_MW": 0.0
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 7.0,
      "Baseline_MW": 11930.4,
      "ControlledLoad_MW": 11930.4,
      "Change_MW": 0.0
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 8.0,
      "Baseline_MW": 12458.2,
      "ControlledLoad_MW": 12458.2,
      "Change_MW": 0.0
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 9.0,
      "Baseline_MW": 12819.8,
      "ControlledLoad_MW": 12819.8,
      "Change_MW": 0.0
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 10.0,
      "Baseline_MW": 12990.3,
      "ControlledLoad_MW": 12990.3,
      "Change_MW": 0.0
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 11.0,
      "Baseline_MW": 13290.9,
      "ControlledLoad_MW": 13290.9,
      "Change_MW": 0.0
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 12.0,
      "Baseline_MW": 13699.8,
      "ControlledLoad_MW": 13345.7251833333,
      "Change_MW": -354.0748166667
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 13.0,
      "Baseline_MW": 14110.9,
      "ControlledLoad_MW": 13756.8251833333,
      "Change_MW": -354.0748166667
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 14.0,
      "Baseline_MW": 13837.4,
      "ControlledLoad_MW": 13483.3251833333,
      "Change_MW": -354.0748166667
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 15.0,
      "Baseline_MW": 13774.3,
      "ControlledLoad_MW": 13420.2251833333,
      "Change_MW": -354.0748166667
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 16.0,
      "Baseline_MW": 13588.7,
      "ControlledLoad_MW": 13234.6251833333,
      "Change_MW": -354.0748166667
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 17.0,
      "Baseline_MW": 13052.4,
      "ControlledLoad_MW": 12698.3251833333,
      "Change_MW": -354.0748166667
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 18.0,
      "Baseline_MW": 12908.7,
      "ControlledLoad_MW": 12908.7,
      "Change_MW": 0.0
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 19.0,
      "Baseline_MW": 12826.5,
      "ControlledLoad_MW": 12826.5,
      "Change_MW": 0.0
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 20.0,
      "Baseline_MW": 12757.4,
      "ControlledLoad_MW": 12757.4,
      "Change_MW": 0.0
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 21.0,
      "Baseline_MW": 12268.2,
      "ControlledLoad_MW": 12268.2,
      "Change_MW": 0.0
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 22.0,
      "Baseline_MW": 11892.1,
      "ControlledLoad_MW": 11892.1,
      "Change_MW": 0.0
    },
    {
      "Method": "Fixed-time DR",
      "Hour": 23.0,
      "Baseline_MW": 12338.1,
      "ControlledLoad_MW": 12338.1,
      "Change_MW": 0.0
    },
    {
      "Method": "Direct DR",
      "Hour": 0.0,
      "Baseline_MW": 11742.1,
      "ControlledLoad_MW": 12131.784225,
      "Change_MW": 389.684224999999
    },
    {
      "Method": "Direct DR",
      "Hour": 1.0,
      "Baseline_MW": 12082.3,
      "ControlledLoad_MW": 12082.3,
      "Change_MW": 0.0
    },
    {
      "Method": "Direct DR",
      "Hour": 2.0,
      "Baseline_MW": 12005.6,
      "ControlledLoad_MW": 12005.6,
      "Change_MW": 0.0
    },
    {
      "Method": "Direct DR",
      "Hour": 3.0,
      "Baseline_MW": 12105.7,
      "ControlledLoad_MW": 12105.7,
      "Change_MW": 0.0
    },
    {
      "Method": "Direct DR",
      "Hour": 4.0,
      "Baseline_MW": 11766.2,
      "ControlledLoad_MW": 12131.784225,
      "Change_MW": 365.584224999999
    },
    {
      "Method": "Direct DR",
      "Hour": 5.0,
      "Baseline_MW": 11645.3,
      "ControlledLoad_MW": 12109.356,
      "Change_MW": 464.056
    },
    {
      "Method": "Direct DR",
      "Hour": 6.0,
      "Baseline_MW": 11601.4,
      "ControlledLoad_MW": 12065.456,
      "Change_MW": 464.056
    },
    {
      "Method": "Direct DR",
      "Hour": 7.0,
      "Baseline_MW": 11930.4,
      "ControlledLoad_MW": 12131.784225,
      "Change_MW": 201.384225
    },
    {
      "Method": "Direct DR",
      "Hour": 8.0,
      "Baseline_MW": 12458.2,
      "ControlledLoad_MW": 12458.2,
      "Change_MW": 0.0
    },
    {
      "Method": "Direct DR",
      "Hour": 9.0,
      "Baseline_MW": 12819.8,
      "ControlledLoad_MW": 12819.8,
      "Change_MW": 0.0
    },
    {
      "Method": "Direct DR",
      "Hour": 10.0,
      "Baseline_MW": 12990.3,
      "ControlledLoad_MW": 12990.3,
      "Change_MW": 0.0
    },
    {
      "Method": "Direct DR",
      "Hour": 11.0,
      "Baseline_MW": 13290.9,
      "ControlledLoad_MW": 13282.3730333333,
      "Change_MW": -8.52696666669908
    },
    {
      "Method": "Direct DR",
      "Hour": 12.0,
      "Baseline_MW": 13699.8,
      "ControlledLoad_MW": 13282.3730333333,
      "Change_MW": -417.426966666699
    },
    {
      "Method": "Direct DR",
      "Hour": 13.0,
      "Baseline_MW": 14110.9,
      "ControlledLoad_MW": 13646.844,
      "Change_MW": -464.056
    },
    {
      "Method": "Direct DR",
      "Hour": 14.0,
      "Baseline_MW": 13837.4,
      "ControlledLoad_MW": 13373.344,
      "Change_MW": -464.056
    },
    {
      "Method": "Direct DR",
      "Hour": 15.0,
      "Baseline_MW": 13774.3,
      "ControlledLoad_MW": 13310.244,
      "Change_MW": -464.055999999999
    },
    {
      "Method": "Direct DR",
      "Hour": 16.0,
      "Baseline_MW": 13588.7,
      "ControlledLoad_MW": 13282.3730333333,
      "Change_MW": -306.3269666667
    },
    {
      "Method": "Direct DR",
      "Hour": 17.0,
      "Baseline_MW": 13052.4,
      "ControlledLoad_MW": 13052.4,
      "Change_MW": 0.0
    },
    {
      "Method": "Direct DR",
      "Hour": 18.0,
      "Baseline_MW": 12908.7,
      "ControlledLoad_MW": 12908.7,
      "Change_MW": 0.0
    },
    {
      "Method": "Direct DR",
      "Hour": 19.0,
      "Baseline_MW": 12826.5,
      "ControlledLoad_MW": 12826.5,
      "Change_MW": 0.0
    },
    {
      "Method": "Direct DR",
      "Hour": 20.0,
      "Baseline_MW": 12757.4,
      "ControlledLoad_MW": 12757.4,
      "Change_MW": 0.0
    },
    {
      "Method": "Direct DR",
      "Hour": 21.0,
      "Baseline_MW": 12268.2,
      "ControlledLoad_MW": 12268.2,
      "Change_MW": 0.0
    },
    {
      "Method": "Direct DR",
      "Hour": 22.0,
      "Baseline_MW": 11892.1,
      "ControlledLoad_MW": 12131.784225,
      "Change_MW": 239.684224999999
    },
    {
      "Method": "Direct DR",
      "Hour": 23.0,
      "Baseline_MW": 12338.1,
      "ControlledLoad_MW": 12338.1,
      "Change_MW": 0.0
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 0.0,
      "Baseline_MW": 11742.1,
      "ControlledLoad_MW": 12015.7187606751,
      "Change_MW": 273.618760675099
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 1.0,
      "Baseline_MW": 12082.3,
      "ControlledLoad_MW": 12082.3,
      "Change_MW": 0.0
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 2.0,
      "Baseline_MW": 12005.6,
      "ControlledLoad_MW": 12005.6,
      "Change_MW": 0.0
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 3.0,
      "Baseline_MW": 12105.7,
      "ControlledLoad_MW": 12105.7,
      "Change_MW": 0.0
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 4.0,
      "Baseline_MW": 11766.2,
      "ControlledLoad_MW": 12175.3828695031,
      "Change_MW": 409.1828695031
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 5.0,
      "Baseline_MW": 11645.3,
      "ControlledLoad_MW": 12109.356,
      "Change_MW": 464.056
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 6.0,
      "Baseline_MW": 11601.4,
      "ControlledLoad_MW": 12065.456,
      "Change_MW": 464.056
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 7.0,
      "Baseline_MW": 11930.4,
      "ControlledLoad_MW": 12203.9173484065,
      "Change_MW": 273.5173484065
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 8.0,
      "Baseline_MW": 12458.2,
      "ControlledLoad_MW": 12458.2,
      "Change_MW": 0.0
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 9.0,
      "Baseline_MW": 12819.8,
      "ControlledLoad_MW": 12819.8,
      "Change_MW": 0.0
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 10.0,
      "Baseline_MW": 12990.3,
      "ControlledLoad_MW": 12990.3,
      "Change_MW": 0.0
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 11.0,
      "Baseline_MW": 13290.9,
      "ControlledLoad_MW": 13200.682933079,
      "Change_MW": -90.2170669209991
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 12.0,
      "Baseline_MW": 13699.8,
      "ControlledLoad_MW": 13246.1177141455,
      "Change_MW": -453.6822858545
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 13.0,
      "Baseline_MW": 14110.9,
      "ControlledLoad_MW": 13646.844,
      "Change_MW": -464.056
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 14.0,
      "Baseline_MW": 13837.4,
      "ControlledLoad_MW": 13373.344,
      "Change_MW": -464.056
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 15.0,
      "Baseline_MW": 13774.3,
      "ControlledLoad_MW": 13310.244,
      "Change_MW": -464.055999999999
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 16.0,
      "Baseline_MW": 13588.7,
      "ControlledLoad_MW": 13400.3184527755,
      "Change_MW": -188.381547224501
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 17.0,
      "Baseline_MW": 13052.4,
      "ControlledLoad_MW": 13052.4,
      "Change_MW": 0.0
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 18.0,
      "Baseline_MW": 12908.7,
      "ControlledLoad_MW": 12908.7,
      "Change_MW": 0.0
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 19.0,
      "Baseline_MW": 12826.5,
      "ControlledLoad_MW": 12826.5,
      "Change_MW": 0.0
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 20.0,
      "Baseline_MW": 12757.4,
      "ControlledLoad_MW": 12757.4,
      "Change_MW": 0.0
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 21.0,
      "Baseline_MW": 12268.2,
      "ControlledLoad_MW": 12268.2,
      "Change_MW": 0.0
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 22.0,
      "Baseline_MW": 11892.1,
      "ControlledLoad_MW": 11892.1,
      "Change_MW": 0.0
    },
    {
      "Method": "Fourier-guided DR",
      "Hour": 23.0,
      "Baseline_MW": 12338.1,
      "ControlledLoad_MW": 12578.1179214153,
      "Change_MW": 240.017921415299
    }
  ],
  "demandSummary": [
    {
      "Method": "Fixed-time DR",
      "HoursReduced": 6.0,
      "HoursAdded": 6.0,
      "MaxReduction_MW": 354.0748166667,
      "EnergyShifted_MWh": 2124.4489000002
    },
    {
      "Method": "Direct DR",
      "HoursReduced": 6.0,
      "HoursAdded": 6.0,
      "MaxReduction_MW": 464.056,
      "EnergyShifted_MWh": 2124.4489000001
    },
    {
      "Method": "Fourier-guided DR",
      "HoursReduced": 6.0,
      "HoursAdded": 6.0,
      "MaxReduction_MW": 464.056,
      "EnergyShifted_MWh": 2124.4489
    }
  ]
};
