from main import format_gov_df, format_pulse_df, format_dap_df, format_other_df
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
        pass

    def test_format_dap_df(self):
        pass

    def test_format_other_df(self):
        pass

if __name__ == '__main__':
    unittest.main()
