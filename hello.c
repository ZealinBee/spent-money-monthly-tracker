#include <stdio.h>

int main()
{
    int i, numberOfBills, sum = 0;
    printf("Enter the number of bills: ");
    scanf("%d", &numberOfBills);
    int bills = [numberOfBills];

    for (i = 0; i < numberOfBills; i++)
    {
        printf("Bill #%d: ", i + 1);
        scanf("%d", &bills[i]);
        sum += bills[i];
    }
    for (i = 0; i < numberOfBills; i++)
    {
        if (i != numberOfBills - 1)
        {
            printf("%d + ", bills[i]);
        }
        else
        {
            printf("%d = %d", bills[i], sum);
        }
    }

    return 0;
}