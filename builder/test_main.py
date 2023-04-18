from main import format_gov_df, format_pulse_df, format_dap_df, format_other_df, format_source_columns, format_agency_and_bureau_codes
import pandas
import unittest


class TestMain(unittest.TestCase):

    def test_format_gov_df(self):
        test_gov_df = pandas.DataFrame({
            'Domain Name': ['AMTRAKOIG.GOV'],
            'Domain Type': ['Federal - Executive'],
            'Agency': ['AMTRAK'],
            'Organization': ['Office of Inspector General'],
            'City': ['Washington'],
            'State': ['DC'],
            'Security Contact Email': ['(blank)']
        })

        expected_gov_df = pandas.DataFrame({
            'target_url': ['amtrakoig.gov', 'www.amtrakoig.gov'],
            'branch': ['Executive', 'Executive'],
            'agency': ['AMTRAK', 'AMTRAK'],
            'bureau': ['Office of Inspector General', 'Office of Inspector General'],
            'base_domain': ['amtrakoig.gov', 'amtrakoig.gov'],
            'source_list_federal_domains': ['TRUE', 'TRUE']
        })

        actual_gov_df = format_gov_df(test_gov_df)

        pandas.testing.assert_frame_equal(
            expected_gov_df.reset_index(drop=True),
            actual_gov_df.reset_index(drop=True)
        )

    def test_format_pulse_df(self):
        test_pulse_df = pandas.DataFrame({
            'Domain': ['18f.gov'],
            'Base Domain': ['18f.gov'],
            'URL': ['https://18f.gov'],
            'Agency': ['General Services Administration'],
            'Sources': ['dotgov'],
            'Compliant with M-15-13 and BOD 18-01': ['Yes'],
            'Enforces HTTPS': ['Yes'],
            'Strict Transport Security (HSTS)': ['Yes'],
            'Free of RC4/3DES and SSLv2/SSLv3': ['Yes'],
            '3DES': ['No'],
            'RC4': ['No'],
            'SSLv2': ['No'],
            'SSLv3': ['No'],
            'Preloaded': ['Yes']
        })

        expected_pulse_df = pandas.DataFrame({
            'target_url': ['18f.gov'],
            'base_domain': ['18f.gov'],
            'source_list_pulse': ['TRUE']
        })

        actual_pulse_df = format_pulse_df(test_pulse_df)

        pandas.testing.assert_frame_equal(
            expected_pulse_df.reset_index(drop=True),
            actual_pulse_df.reset_index(drop=True)
        )

    def test_format_dap_df(self):
        test_dap_df = pandas.DataFrame({
            'domain': ['1.usa.gov']
        })

        expected_dap_df = pandas.DataFrame({
            'target_url': ['1.usa.gov'],
            'base_domain': ['usa.gov'],
            'source_list_dap': ['TRUE']
        })

        actual_dap_df = format_dap_df(test_dap_df)

        pandas.testing.assert_frame_equal(
            expected_dap_df.reset_index(drop=True),
            actual_dap_df.reset_index(drop=True)
        )

    def test_format_other_df(self):
        test_other_df = pandas.DataFrame({
            'target_url': ['ab2d.cms.gov']
        })

        expected_other_df = pandas.DataFrame({
            'target_url': ['ab2d.cms.gov'],
            'base_domain_other': ['cms.gov'],
            'source_list_other': ['TRUE']
        })

        actual_other_df = format_other_df(test_other_df)

        pandas.testing.assert_frame_equal(
            expected_other_df.reset_index(drop=True),
            actual_other_df.reset_index(drop=True)
        )

    def test_format_source_columns(self):
        test_df = pandas.DataFrame({
            'target_url': ['mypay.gov'],
            'base_domain': ['mypay.gov'],
            'branch': ['Executive'],
            'agency': ['Department of Defense'],
            'bureau': ['Defense Finance and Accounting Service'],
            'source_list_federal_domains': ['TRUE'],
            'source_list_pulse': [''],
            'source_list_dap': [''],
            'source_list_other': [''],
        })

        expected_df = pandas.DataFrame({
            'target_url': ['mypay.gov'],
            'base_domain': ['mypay.gov'],
            'branch': ['Executive'],
            'agency': ['Department of Defense'],
            'bureau': ['Defense Finance and Accounting Service'],
            'source_list_federal_domains': ['TRUE'],
            'source_list_pulse': ['FALSE'],
            'source_list_dap': ['FALSE'],
            'source_list_other': ['FALSE'],
        })

        actual_df = format_source_columns(test_df)

        pandas.testing.assert_frame_equal(
            expected_df.reset_index(drop=True),
            actual_df.reset_index(drop=True)
        )

    def test_format_agency_and_bureau_codes(self):
        test_df = pandas.DataFrame({
            'target_url': ['nationsreportcard.gov'],
            'base_domain': ['nationsreportcard.gov'],
            'branch': ['Executive'],
            'agency': ['Department of Education'],
            'bureau': ['Office of Chief Information Officer'],
            'agency_code': [18.0],
            'bureau_code': [12.0],
        })

        expected_df = pandas.DataFrame({
            'target_url': ['nationsreportcard.gov'],
            'base_domain': ['nationsreportcard.gov'],
            'branch': ['Executive'],
            'agency': ['Department of Education'],
            'bureau': ['Office of Chief Information Officer'],
            'agency_code': [18],
            'bureau_code': [12],
        })

        actual_df = format_agency_and_bureau_codes(test_df)

        pandas.testing.assert_frame_equal(
            expected_df.reset_index(drop=True),
            actual_df.reset_index(drop=True)
        )

    def test_format_round_bureau_code(self):
        pass

if __name__ == '__main__':
    unittest.main()
